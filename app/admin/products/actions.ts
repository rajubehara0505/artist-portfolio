"use server";

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

  if (error) {
    throw new Error(error.message);
  }

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

  if (error) {
    throw new Error(error.message);
  }

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

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string) {
  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Toggle publish state
 */
export async function setProductPublished(
  productId: string,
  isPublished: boolean
) {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("products")
    .update({ is_published: isPublished })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
