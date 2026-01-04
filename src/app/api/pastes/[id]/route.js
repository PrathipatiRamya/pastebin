import { getPaste, savePaste, deletePaste } from "@/lib/store";
import { nowMs } from "@/lib/time";

export async function GET(req, { params }) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(req.headers);

  // TTL check
  if (paste.ttl_seconds !== null) {
    const expiresAt = paste.created_at + paste.ttl_seconds * 1000;
    if (now >= expiresAt) {
      await deletePaste(id);
      return Response.json({ error: "Expired" }, { status: 404 });
    }
  }

  // Max views check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    await deletePaste(id);
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Increment view count (ONLY HERE)
  paste.views += 1;
  await savePaste(id, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - paste.views, 0),
    expires_at:
      paste.ttl_seconds === null
        ? null
        : new Date(paste.created_at + paste.ttl_seconds * 1000).toISOString(),
  });
}
