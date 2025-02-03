// WORKS: looks like it, implement later
import {S3} from "aws-sdk";
import {NextRequest} from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {fileName, fileType} = await req.json();

    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: "v4"
    });

    // generates URL for direct upload
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${fileName}`,
      Expires: 60,
      ContentType: fileType
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    console.log(uploadUrl);
    return Response.json({uploadUrl});
  } catch (err) {
    return Response.json({err: err.message}, {status: 505});
  }
}
