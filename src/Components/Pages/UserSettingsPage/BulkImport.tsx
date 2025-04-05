"use client";

import { useState } from "react";

export default function BulkImport({ tournamentId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tournamentId", tournamentId);
    console.log("FORMDATA", formData);
    const res = await fetch("/api/player-import", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(`Success: ${result.message} (${result.count} players)`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Import Players</button>
      <p>{message}</p>
    </form>
  );
}
