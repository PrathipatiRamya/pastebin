import { getPaste, deletePaste, savePaste } from "@/lib/store";
import { nowMs } from "@/lib/time";

export async function GET(req, { params }) {
  const paste = getPaste(params.id);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(req.headers);

  // TTL check
  let expires_at = null;
  if (paste.ttl_seconds !== null) {
    expires_at = paste.created_at + paste.ttl_seconds * 1000;
    if (now >= expires_at) {
      deletePaste(params.id);
      return Response.json({ error: "Expired" }, { status: 404 });
    }
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    deletePaste(params.id);
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Count this view
  paste.views += 1;
  savePaste(params.id, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - paste.views, 0),
    expires_at: expires_at ? new Date(expires_at).toISOString() : null,
  });
}
