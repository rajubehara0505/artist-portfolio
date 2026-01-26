import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import { notFound } from "next/navigation";
import { deleteProductImage, setCoverImage } from "@/app/admin/products/actions";


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
    id: string;
    path: string;
    alt: string | null;
    sort_order: number;
  }[];
};

function toPublicImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path; // legacy rows
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/artworks/${path}`;
}

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
        id,
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
        <p className="text-red-600">Failed to load artwork: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    notFound();
  }

  const product = data as Product;
  const firstImage = product.product_images?.[0];
  const firstImageUrl = firstImage ? toPublicImageUrl(firstImage.path) : "";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            {firstImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={firstImageUrl}
                  alt={firstImage.alt ?? product.title}
                  className="h-full w-full object-cover"
                />
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>

          {/* Admin delete button and setcover  (outside the clipped box) */}
            
          {firstImage ? (
            <div className="mt-2 flex items-center gap-4">
              {product.product_images.length > 1 ? (
                <form
                  action={async () => {
                    "use server";
                    // Set the SECOND image as cover for now (until we build thumbnails UI)
                    const second = product.product_images[1];
                    if (second) {
                      await setCoverImage(second.id, product.slug);
                    }
                  }}
                >
                  <button type="submit" className="text-sm hover:underline">
                    Set next image as cover
                  </button>
                </form>
              ) : null}

              <form
                action={async () => {
                  "use server";
                  await deleteProductImage(firstImage.id);
                }}
              >
                <button type="submit" className="text-sm text-red-600 hover:underline">
                  Delete image
                </button>
              </form>
            </div>
          ) : null}

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
