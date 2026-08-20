import {
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const deleteFromS3 = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    const url = new URL(imageUrl);

    const key = decodeURIComponent(
      url.pathname.substring(1)
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error("S3 delete error:", error.message);
  }
};

export default s3;