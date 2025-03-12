// WORKS: probably, saved for later
"use client";
import { useState } from "react";
import Button from "../Buttons/Button";

export default function ImageUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => setFile(event.target.files[0]);
  const handleUpload = async () => {
    if (!file) return;

    const res = await fetch("api/imageUpload", {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    const { uploadUrl } = await res.json();

    // uploads the file to S3
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    alert("File uploaded");
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Button
        className="self-center my-6 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded"
        onClick={handleUpload}
      >
        Upload the Image
      </Button>
    </div>
  );
}
