import { Storage } from "@google-cloud/storage";
import { NextRequest } from "next/server";

// Decode base64 string into JSON
const gcsCredentials = process.env.GOOGLE_BUCKET_CREDENTIALS
  ? JSON.parse(Buffer.from(process.env.GOOGLE_BUCKET_CREDENTIALS, "base64").toString("utf8"))
  : undefined;

const storage = new Storage({ credentials: gcsCredentials });
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
