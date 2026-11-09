import { type NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  minioClient,
  PutObjectCommand,
  MINIO_BUCKET,
  MINIO_PUBLIC_URL,
  MINIO_CONFIGURED,
} from "@/lib/minio";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB, matches the client-side check
const MAX_FILES = 10;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const ALLOWED_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "webp", "pdf", "txt", "csv",
  "doc", "docx", "xls", "xlsx", "ppt", "pptx",
]);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!MINIO_CONFIGURED) {
      console.error("MinIO credentials are not configured (MINIO_ACCESS_KEY / MINIO_SECRET_KEY)");
      return NextResponse.json(
        { error: "File storage is not configured. Contact the administrator." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `You can upload at most ${MAX_FILES} files at a time` },
        { status: 400 }
      );
    }

    // Validate everything before uploading anything
    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name} exceeds the 15MB limit` },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `${file.name} is not an allowed file type` },
          { status: 400 }
        );
      }
    }

    const uploaded = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Unguessable key; keep a sanitized name for readability
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(-100);
      const key = `tickets/${randomUUID()}-${sanitizedName}`;
      const isImage = file.type.startsWith("image/");

      await minioClient.send(
        new PutObjectCommand({
          Bucket: MINIO_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          // Non-images download instead of rendering in the browser
          ContentDisposition: isImage
            ? undefined
            : `attachment; filename="${sanitizedName}"`,
        })
      );

      const publicUrl = `${MINIO_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
      uploaded.push({
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
      });
    }

    return NextResponse.json({ files: uploaded });
  } catch (err: any) {
    console.error("MinIO upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload file to storage" },
      { status: 500 }
    );
  }
}
