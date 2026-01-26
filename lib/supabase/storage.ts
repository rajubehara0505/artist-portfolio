import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createBrowserClient(supabaseUrl, anonKey);

export function getPublicImageUrl(path: string) {
  // If already a full URL (legacy rows), return as-is
  if (path.startsWith("http")) {
    return path;
  }

  // Otherwise generate public URL from storage path
  return supabase.storage
    .from("artworks")
    .getPublicUrl(path).data.publicUrl;
}
