import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.MINIO_ENDPOINT || "https://media.tamarind.co.ke";
const region = process.env.MINIO_REGION || "us-east-1";
const accessKeyId = process.env.MINIO_ACCESS_KEY || "9qIh44oehMC7jBatUOR1";
const secretAccessKey = process.env.MINIO_SECRET_KEY || "def15jyaoN9kYivByybsVjE5ThgpsSyC8WhpnjXL";

export const minioClient = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true, // Required for MinIO path-style bucket addressing
});

export const MINIO_BUCKET = process.env.MINIO_BUCKET || "tml-helpdesk";

export const MINIO_PUBLIC_URL =
  process.env.MINIO_PUBLIC_URL ||
  `${endpoint.replace(/\/$/, "")}/${MINIO_BUCKET}`;

export { PutObjectCommand };
