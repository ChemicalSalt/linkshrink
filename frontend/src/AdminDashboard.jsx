import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    async function fetchUrls() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/urls", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          // Unauthorized, token invalid
          localStorage.removeItem("token");
          navigate("/admin/login");
          return;
        }
        const data = await res.json();
        if (res.ok) {
          setUrls(data);
        } else {
          setError(data.error || "Failed to fetch URLs");
        }
      } catch {
        setError("Network error");
      }
    }
    fetchUrls();
  }, [navigate]);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>Admin Dashboard - All Shortened URLs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Original URL</th>
            <th>Visit Count</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {urls.length === 0 ? (
            <tr><td colSpan="4">No URLs found.</td></tr>
          ) : (
            urls.map(({ short_code, original_url, visit_count, created_at }) => (
              <tr key={short_code}>
                <td>{short_code}</td>
                <td><a href={original_url} target="_blank" rel="noopener noreferrer">{original_url}</a></td>
                <td>{visit_count}</td>
                <td>{new Date(created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
