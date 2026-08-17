import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import type { SupabaseClient } from "@supabase/supabase-js";

async function uniqueSlug(
  admin: SupabaseClient,
  base: string,
  excludeId?: string
): Promise<string> {
  let slug = base;
  let attempt = 2;

  while (true) {
    let query = admin.from("categories").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();

    if (!data) return slug;
    slug = `${base}-${attempt}`;
    attempt += 1;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { name?: string; name_bn?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const nameBn = body.name_bn?.trim();

  if (!name || !nameBn) {
    return NextResponse.json(
      { error: "Both English and Bengali names are required" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  const slug = await uniqueSlug(admin, slugify(name), id);

  const { data, error } = await admin
    .from("categories")
    .update({ name, name_bn: nameBn, slug })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("update category error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/shop");

  return NextResponse.json({ category: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = getSupabaseAdmin();

  // Products in this category aren't deleted — the FK is ON DELETE SET NULL,
  // so they just become uncategorized.
  const { error } = await admin.from("categories").delete().eq("id", id);

  if (error) {
    console.error("delete category error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/shop");

  return NextResponse.json({ ok: true });
}
