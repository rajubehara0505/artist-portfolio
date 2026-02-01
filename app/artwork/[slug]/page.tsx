import Link from "next/link"
import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/ssr"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

type Product = {
  id: string
  title: string
  slug: string
  description: string | null
  price_cents: number | null
  currency: string | null
  is_published: boolean
  product_images: {
    id: string
    path: string
    alt: string | null
    sort_order: number
  }[]
}

function toPublicImageUrl(path: string) {
  if (!path) return ""
  if (path.startsWith("http")) return path
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/artworks/${path}`
}

function formatPrice(price_cents: number | null, currency: string | null) {
  if (!price_cents || price_cents <= 0) return null
  return `${(price_cents / 100).toFixed(2)} ${currency ?? ""}`.trim()
}

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

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
    .order("sort_order", { referencedTable: "product_images", ascending: true })
    .maybeSingle()

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 max-w-5xl mx-auto">
          <p className="text-red-600">Failed to load artwork: {error.message}</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!data) notFound()

  const product = data as Product
  const firstImage = product.product_images?.[0]
  const firstImageUrl = firstImage ? toPublicImageUrl(firstImage.path) : ""
  const priceText = formatPrice(product.price_cents, product.currency)

  // ✅ This MUST be the link that makes Contact show "Regarding"
  const inquiryHref = `/contact?artwork=${encodeURIComponent(product.slug)}`

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Top actions */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link href="/gallery" className="text-sm text-muted-foreground hover:underline">
              ← Back to gallery
            </Link>

            {/* <Button asChild>
              <Link href={inquiryHref}>Inquire to buy</Link>
            </Button> */}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Image */}
            <div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
                {firstImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={firstImageUrl}
                    alt={firstImage.alt ?? product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>

              <p className="mt-3 text-muted-foreground">{priceText ? priceText : "Price on request"}</p>

              <div className="mt-6">
                <Button asChild className="w-full sm:w-auto">
                  <Link href={inquiryHref}>Inquire about this artwork</Link>
                </Button>
              </div>

              {product.description ? (
                <p className="mt-6 leading-relaxed whitespace-pre-line">{product.description}</p>
              ) : (
                <p className="mt-6 text-muted-foreground">
                  For details about availability, dimensions, medium, and pricing, please send an inquiry.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
