import { kv } from "@vercel/kv";

export async function GET() {
  await kv.set("healthz", "ok");
  return Response.json({ ok: true });
}
