import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Product {
  id: string
  title: string
  slug: string
  price_cents: number | null
  currency: string | null
  product_images?: {
    id: string
    path: string
    alt: string | null
    sort_order: number
  }[]
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
    <Link href={`/artwork/${artwork.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={coverUrl}
              alt={cover?.alt ?? artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start p-4 space-y-2">
          <h3 className="font-semibold text-lg">{artwork.title}</h3>

          {price ? (
            <span className="text-lg font-bold text-primary">
              ${price} {artwork.currency ?? "CAD"}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Price on request
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
