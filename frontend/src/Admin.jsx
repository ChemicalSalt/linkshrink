import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUrls() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/urls");
        if (!res.ok) throw new Error("Failed to fetch URLs");
        const data = await res.json();
        setUrls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUrls();
  }, []);

  if (loading) return <p>Loading URLs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>Admin: All Shortened URLs</h2>
      {urls.length === 0 ? (
        <p>No URLs found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Short Code</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Original URL</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Visits</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url._id}>
                <td style={{ padding: "8px", textAlign: "center" }}>{url.short_code}</td>
                <td style={{ padding: "8px" }}>
                  <a href={url.original_url} target="_blank" rel="noopener noreferrer">
                    {url.original_url.length > 40
                      ? url.original_url.slice(0, 40) + "..."
                      : url.original_url}
                  </a>
                </td>
                <td style={{ padding: "8px", textAlign: "center" }}>{url.visit_count}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  {new Date(url.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
