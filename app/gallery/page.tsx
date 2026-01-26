import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import Link from "next/link";

type GalleryItem = {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
  currency: string;
  featured: boolean;
  is_published: boolean;
  product_images: { path: string; alt: string | null; sort_order: number }[];
};

export default async function GalleryPage() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      title,
      slug,
      price_cents,
      currency,
      featured,
      is_published,
      product_images (
        path,
        alt,
        sort_order
      )
    `
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .order("sort_order", { referencedTable: "product_images", ascending: true });

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Gallery</h1>
        <p className="mt-4 text-red-600">Failed to load products: {error.message}</p>
      </div>
    );
  }

  const products = (data ?? []) as GalleryItem[];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Gallery</h1>

      {products.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No published artworks yet.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const firstImage = p.product_images?.[0];
            return (
              <Link
                key={p.id}
                href={`/artwork/${p.slug}`}
                className="block overflow-hidden rounded-xl border hover:shadow-sm transition"
              >
                <div className="aspect-[4/3] w-full bg-muted">
                  {firstImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={firstImage.path}
                      alt={firstImage.alt ?? p.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-medium">{p.title}</h2>
                    {p.featured ? (
                      <span className="rounded-full bg-black text-white px-2 py-1 text-xs">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {(p.price_cents / 100).toFixed(2)} {p.currency}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
