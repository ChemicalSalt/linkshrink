import React, { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!longUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error");
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your long URL here"
        className="input"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
      />
      <button type="submit" className="button">
        Shorten
      </button>

      {error && <p className="error">{error}</p>}

      {shortUrl && (
        <p className="result">
          Short URL:{" "}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </form>
  );
}
