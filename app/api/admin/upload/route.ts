import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { cloudinary, CLOUDINARY_UPLOAD_FOLDER } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folderSuffix = form.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const folder = [CLOUDINARY_UPLOAD_FOLDER, typeof folderSuffix === "string" ? folderSuffix : ""]
    .filter(Boolean)
    .join("/");

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (err) {
    console.error("[admin/upload] Cloudinary error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const publicId = searchParams.get("publicId");
  if (!publicId) {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return NextResponse.json({ result: result.result });
  } catch (err) {
    console.error("[admin/upload] Cloudinary delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
