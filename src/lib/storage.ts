// Serviço de storage — MinIO (S3 compatible)
// Para uploads de logos, relatórios PDF, etc.
import { Client as MinioClient } from "minio";

// Cliente MinIO — conecta ao container local
const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin123",
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "dentalmetrics";

// Garante que o bucket existe
async function ensureBucket(): Promise<void> {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
    // Configura política de leitura pública para avatares
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/public/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    console.log(`[MINIO] Bucket "${BUCKET_NAME}" criado com política pública`);
  }
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

// Upload de arquivo
export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<UploadResult> {
  await ensureBucket();

  await minioClient.putObject(BUCKET_NAME, key, buffer, buffer.length, {
    "Content-Type": contentType,
  });

  const url = `${process.env.MINIO_PUBLIC_URL || "http://localhost:9000"}/${BUCKET_NAME}/${key}`;

  return { url, key, size: buffer.length };
}

// Upload de avatar/logo (pasta pública)
export async function uploadAvatar(
  clinicId: string,
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<UploadResult> {
  const key = `public/avatars/${clinicId}/${filename}`;
  return uploadFile(key, buffer, contentType);
}

// Upload de relatório PDF
export async function uploadReport(
  clinicId: string,
  filename: string,
  buffer: Buffer
): Promise<UploadResult> {
  const key = `private/reports/${clinicId}/${filename}`;
  return uploadFile(key, buffer, "application/pdf");
}

// Gera URL pré-assinada para download (arquivos privados)
export async function getSignedUrl(key: string, expiry = 3600): Promise<string> {
  return minioClient.presignedGetObject(BUCKET_NAME, key, expiry);
}

// Remove arquivo
export async function deleteFile(key: string): Promise<void> {
  await minioClient.removeObject(BUCKET_NAME, key);
}

// Lista arquivos de uma pasta
export async function listFiles(prefix: string): Promise<string[]> {
  const files: string[] = [];
  const stream = minioClient.listObjects(BUCKET_NAME, prefix, true);
  for await (const obj of stream) {
    if (obj.name) files.push(obj.name);
  }
  return files;
}
