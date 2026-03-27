import Image from "next/image"
import Link from "next/link"

interface ProductImage {
  id: string
  path: string
  alt: string | null
  sort_order: number
}

interface Product {
  id: string
  title: string
  slug: string
  price_cents: number | null
  currency: string | null
  product_images?: ProductImage[]
}

interface ArtworkCardProps {
  artwork: Product
}

function toPublicImageUrl(path: string) {
  if (!path) return ""
  if (path.startsWith("http")) return path

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/artworks/${path}`
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const cover = artwork.product_images?.[0]
  const coverUrl = cover?.path ? toPublicImageUrl(cover.path) : "/placeholder.svg"

  const price =
    artwork.price_cents != null
      ? ((artwork.price_cents ?? 0) / 100).toFixed(2)
      : null

  return (
    <Link href={`/artwork/${artwork.slug}`} className="group block">
      <article className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-2xl">
  <div className="relative aspect-[4/4.1] overflow-hidden bg-muted">
    <Image
      src={coverUrl}
      alt={cover?.alt ?? artwork.title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
    />

    {/* premium overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100" />

    {/* subtle shine */}
    <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)]" />
  </div>

  <div className="space-y-2 px-4 py-4">
    <h3 className="font-serif text-xl tracking-tight">
      {artwork.title}
    </h3>

    <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground">
      {price ? `$${price} ${artwork.currency ?? "CAD"}` : "Price on request"}
    </p>
  </div>
</article>
    </Link>
  )
}