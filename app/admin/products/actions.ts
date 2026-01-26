"use server";
import { revalidatePath } from "next/cache";

import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * List all products (admin)
 */
export async function listProducts() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Create product
 */
export async function createProduct(input: {
  title: string;
  description?: string | null;
  price_cents: number;
  is_published?: boolean;
}) {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("products")
    .insert({
      title: input.title,
      description: input.description ?? null,
      price_cents: input.price_cents,
      is_published: input.is_published ?? false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Update product
 */
export async function updateProduct(
  productId: string,
  input: {
    title?: string;
    description?: string | null;
    price_cents?: number;
    is_published?: boolean;
  }
) {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string) {
  const supabase = getSupabaseServer();

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) throw new Error(error.message);
}

/**
 * Toggle publish state
 */
export async function setProductPublished(productId: string, isPublished: boolean) {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("products")
    .update({ is_published: isPublished })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* -------------------------------------------------------------------------- */
/* Milestone 6: Delete Product Image (DB + Storage + cover ordering)           */
/* -------------------------------------------------------------------------- */

function toStoragePath(pathOrUrl: string) {
  if (!pathOrUrl) return "";
  if (!pathOrUrl.startsWith("http")) return pathOrUrl; // already "products/..."
  const marker = "/artworks/";
  const idx = pathOrUrl.indexOf(marker);
  if (idx === -1) return "";
  return pathOrUrl.slice(idx + marker.length); // "products/..."
}

/**
 * Delete one image:
 * 1) fetch row (need product_id + sort_order + path)
 * 2) delete row from product_images
 * 3) delete file from Storage bucket
 * 4) if deleted image was cover (sort_order=0), re-pack sort_order starting from 0
 */
export async function deleteProductImage(imageId: string) {
  const supabase = getSupabaseServer();

  // 1) Fetch the image row first
  const { data: img, error: fetchErr } = await supabase
    .from("product_images")
    .select("id, product_id, path, sort_order")
    .eq("id", imageId)
    .single();

  if (fetchErr) throw new Error(fetchErr.message);

  const productId = img.product_id as string;
  const sortOrder = img.sort_order as number;
  const storagePath = toStoragePath(img.path as string);

  // 2) Delete DB row
  const { error: dbErr } = await supabase.from("product_images").delete().eq("id", imageId);
  if (dbErr) throw new Error(dbErr.message);

  // 3) Delete storage object (best effort)
  if (storagePath) {
    const { error: storageErr } = await supabase.storage.from("artworks").remove([storagePath]);
    // don't hard-fail if storage delete fails; DB row is already gone
    if (storageErr) {
      return { ok: true, warning: storageErr.message };
    }
  }

  // 4) If cover deleted, re-pack sort_order: 0..n-1
  if (sortOrder === 0) {
    const { data: remaining, error: remErr } = await supabase
      .from("product_images")
      .select("id, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    if (remErr) throw new Error(remErr.message);

    // repack
    for (let i = 0; i < (remaining?.length ?? 0); i++) {
      const row = remaining![i];
      if (row.sort_order !== i) {
        const { error: updErr } = await supabase
          .from("product_images")
          .update({ sort_order: i })
          .eq("id", row.id);
        if (updErr) throw new Error(updErr.message);
      }
    }
  }
revalidatePath("/gallery");
revalidatePath("/artwork/[slug]");


  return { ok: true };
}



/**
 * Set a specific image as cover (sort_order = 0) and repack others to 0..n-1
 * Pass slug so we can revalidate the exact artwork page.
 */
export async function setCoverImage(imageId: string, slug: string) {
  const supabase = getSupabaseServer();

  // 1) Find the image row to get product_id
  const { data: img, error: imgErr } = await supabase
    .from("product_images")
    .select("id, product_id")
    .eq("id", imageId)
    .single();

  if (imgErr) throw new Error(imgErr.message);

  const productId = img.product_id as string;

  // 2) Fetch all images for this product in current order
  const { data: images, error: listErr } = await supabase
    .from("product_images")
    .select("id, sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (listErr) throw new Error(listErr.message);
  if (!images || images.length === 0) return { ok: true };

  // 3) Repack: selected first, then the rest
  const selected = images.find((x) => x.id === imageId);
  if (!selected) throw new Error("Image not found for this product.");

  const reordered = [selected, ...images.filter((x) => x.id !== imageId)];

  // 4) Apply new sort_order 0..n-1
  for (let i = 0; i < reordered.length; i++) {
    const row = reordered[i];
    if (row.sort_order !== i) {
      const { error: updErr } = await supabase
        .from("product_images")
        .update({ sort_order: i })
        .eq("id", row.id);

      if (updErr) throw new Error(updErr.message);
    }
  }

  // 5) Revalidate pages
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/gallery");
  revalidatePath(`/artwork/${slug}`);

  return { ok: true };
}

