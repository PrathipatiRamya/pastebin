"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultUrl("");
    setLoading(true);

    const body = {
      content,
    };

    if (ttl) body.ttl_seconds = Number(ttl);
    if (maxViews) body.max_views = Number(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResultUrl(data.url);
        setContent("");
        setTtl("");
        setMaxViews("");
      }
    } catch (err) {
      setError("Failed to create paste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ width: "100%", padding: "10px" }}
          required
        />

        <div style={{ marginTop: "10px" }}>
          <label>
            TTL (seconds, optional):{" "}
            <input
              type="number"
              min="1"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            Max Views (optional):{" "}
            <input
              type="number"
              min="1"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "15px", padding: "8px 16px" }}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

      {resultUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Shareable URL:</p>
          <a href={resultUrl} target="_blank" rel="noopener noreferrer">
            {resultUrl}
          </a>
        </div>
      )}
    </div>
  );
}
