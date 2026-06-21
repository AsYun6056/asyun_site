export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ids = url.searchParams.get("ids");

    if (!ids) {
      return new Response(JSON.stringify({ error: "No video IDs" }), {
        status: 400,
      });
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(
      ids
    )}&key=${process.env.YOUTUBE_API_KEY}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 API 라우트 에러:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
