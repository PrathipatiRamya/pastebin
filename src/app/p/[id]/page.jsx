import { getPaste } from "@/lib/store";
import { nowMs } from "@/lib/time";

export default async function PastePage({ params }) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    return notFoundUI();
  }

  // TTL check ONLY (no delete!)
  if (paste.ttl_seconds !== null) {
    const expiresAt = paste.created_at + paste.ttl_seconds * 1000;

    if (nowMs(new Headers()) >= expiresAt) {
      return notFoundUI();
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Paste</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f5f5f5",
          padding: "16px",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>
    </div>
  );
}

function notFoundUI() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>404</h1>
      <p>Paste not found or expired.</p>
    </div>
  );
}
