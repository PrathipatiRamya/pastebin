import { savePaste } from "@/lib/store";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.json();

  const { content, ttl_seconds, max_views } = body;

  // Validation
  if (!content || typeof content !== "string" || content.trim() === "") {
    return Response.json({ error: "content is required" }, { status: 400 });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return Response.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return Response.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();
  const now = Date.now();

  savePaste(id, {
    id,
    content,
    created_at: now,
    ttl_seconds: ttl_seconds ?? null,
    max_views: max_views ?? null,
    views: 0,
  });

  const baseUrl = req.headers.get("origin");

  return Response.json(
    {
      id,
      url: `${baseUrl}/p/${id}`,
    },
    { status: 201 }
  );
}
