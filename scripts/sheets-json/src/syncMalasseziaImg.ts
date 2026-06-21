import "dotenv/config";
import { google } from "googleapis";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import pLimit from "p-limit";
import { loadServiceAccount } from ".";

type SAJson = { client_email: string; private_key: string };

const DRIVE_FOLDER_ID = process.env.MALASSEZIA_FOLDER_ID;
const DRIVE_IMAGE_DIR = process.env.DRIVE_IMAGE_DIR || "public/drive-images";
const CONCURRENCY = 3;

async function withRetry<T>(fn: () => Promise<T>, times = 3, delayMs = 800): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < times; i++) {
    try { return await fn(); }
    catch (err) { lastErr = err; if (i < times - 1) await new Promise((r) => setTimeout(r, delayMs)); }
  }
  throw lastErr;
}

type LocalMeta = { files: Record<string, { name: string; md5: string }> };

async function loadMeta(dir: string): Promise<LocalMeta> {
  try { return JSON.parse(await fsp.readFile(path.join(dir, ".malassezia-sync.json"), "utf8")); }
  catch { return { files: {} }; }
}

async function saveMeta(dir: string, meta: LocalMeta) {
  await fsp.writeFile(path.join(dir, ".malassezia-sync.json"), JSON.stringify(meta, null, 2));
}

async function main() {
  if (!DRIVE_FOLDER_ID) {
    throw new Error("Missing env: MALASSEZIA_FOLDER_ID");
  }

  const sa: SAJson = loadServiceAccount();
  const auth = new google.auth.JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const drive = google.drive({ version: "v3", auth });

  await fsp.mkdir(DRIVE_IMAGE_DIR, { recursive: true });
  const meta = await loadMeta(DRIVE_IMAGE_DIR);

  const files: { id: string; name: string; md5Checksum?: string }[] = [];
  let pageToken: string | undefined;
  do {
    const res = await withRetry(() =>
      drive.files.list({
        q: `'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: "nextPageToken, files(id, name, md5Checksum)",
        pageSize: 1000,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        pageToken,
      })
    );
    files.push(...(res.data.files || []).map((f) => ({ id: f.id!, name: f.name!, md5Checksum: f.md5Checksum || undefined })));
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  const toDownload = files.filter((f) => {
    const cur = meta.files[f.id];
    return !cur || cur.md5 !== f.md5Checksum || cur.name !== f.name;
  });

  const limit = pLimit(CONCURRENCY);
  await Promise.all(
    toDownload.map((file) =>
      limit(async () => {
        const destPath = path.join(DRIVE_IMAGE_DIR, file.name);
        await withRetry(() =>
          new Promise<void>((resolve, reject) => {
            drive.files.get({ fileId: file.id, alt: "media" }, { responseType: "stream" })
              .then((res) => {
                const ws = fs.createWriteStream(destPath);
                res.data.pipe(ws);
                ws.on("finish", resolve);
                ws.on("error", reject);
              })
              .catch(reject);
          })
        );
        meta.files[file.id] = { name: file.name, md5: file.md5Checksum || "" };
        console.log(`⬇️  downloaded: ${file.name}`);
      })
    )
  );

  const keepIds = new Set(files.map((f) => f.id));
  for (const [id, info] of Object.entries(meta.files)) {
    if (!keepIds.has(id)) {
      try { await fsp.unlink(path.join(DRIVE_IMAGE_DIR, info.name)); console.log(`🗑️  removed: ${info.name}`); }
      catch {}
      delete meta.files[id];
    }
  }

  await saveMeta(DRIVE_IMAGE_DIR, meta);
  console.log(`✅ sync done. remote: ${files.length}, changed: ${toDownload.length}`);
}

main().catch((err) => { console.error("Sync failed:", err?.response?.data || err); process.exit(1); });
