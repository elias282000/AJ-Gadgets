import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "product-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WEBP, or GIF images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 5MB" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("image upload error:", uploadError.message);
    return NextResponse.json(
      {
        error: `Failed to upload image: ${uploadError.message}. Make sure the "${BUCKET}" storage bucket exists (see sql/storage-setup.sql).`,
      },
      { status: 500 }
    );
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
