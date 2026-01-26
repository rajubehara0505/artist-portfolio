import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import { notFound } from "next/navigation";

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  featured: boolean;
  is_published: boolean;
  product_images: {
    path: string;
    alt: string | null;
    sort_order: number;
  }[];
};

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ IMPORTANT: params is a Promise in your setup
  const { slug } = await params;

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      title,
      slug,
      description,
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
    .eq("slug", slug)
    .eq("is_published", true)
    .order("sort_order", {
      referencedTable: "product_images",
      ascending: true,
    })
    .maybeSingle();

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Failed to load artwork: {error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    notFound();
  }

  const product = data as Product;
  const firstImage = product.product_images?.[0];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
          {firstImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firstImage.path}
              alt={firstImage.alt ?? product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>

          <p className="mt-2 text-muted-foreground">
            {(product.price_cents / 100).toFixed(2)} {product.currency}
          </p>

          {product.description ? (
            <p className="mt-6 leading-relaxed">{product.description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
