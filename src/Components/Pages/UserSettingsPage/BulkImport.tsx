"use client";

import { useState } from "react";

export default function BulkImport({ tournamentId }: { tournamentId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tournamentId", tournamentId);

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
      <input
        type="file"
        accept=".csv"
        // ugly, but guards against TS errors
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <button type="submit">Import Players</button>
      <p>{message}</p>
    </form>
  );
}
