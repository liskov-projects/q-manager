import { Storage } from "@google-cloud/storage";
import { NextRequest } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

// Load credentials from ~/.gcp/gcs-signer-key.json
const credentialsPath = path.resolve(process.env.HOME || "", ".gcp", "gcs-signer-key.json");
const credentials = JSON.parse(await readFile(credentialsPath, "utf-8"));

const storage = new Storage({ credentials });
const bucketName = `tournament-images-${process.env.GCP_PROJECT_ID}`;

export async function GET(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get("fileName");
  const fileType = req.nextUrl.searchParams.get("fileType") || "application/octet-stream";

  if (!fileName) {
    return new Response(JSON.stringify({ error: "Missing fileName" }), { status: 400 });
  }

  const file = storage.bucket(bucketName).file(fileName);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 5 * 60 * 1000,
    contentType: fileType, // ✅ Use the actual file type
  });

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(fileName)}`;

  return new Response(JSON.stringify({ uploadUrl, publicUrl }));
}
