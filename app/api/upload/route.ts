import { type NextRequest, NextResponse } from "next/server";
import { minioClient, PutObjectCommand, MINIO_BUCKET, MINIO_PUBLIC_URL } from "@/lib/minio";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploaded = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize filename and create unique timestamped key
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const key = `tickets/${Date.now()}-${sanitizedName}`;

      await minioClient.send(
        new PutObjectCommand({
          Bucket: MINIO_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: file.type || "application/octet-stream",
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
      { error: err?.message || "Failed to upload file to MinIO storage" },
      { status: 500 }
    );
  }
}
