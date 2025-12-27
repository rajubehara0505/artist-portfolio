import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Artwork } from "@/lib/artworks-data"

interface ArtworkCardProps {
  artwork: Artwork
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const discountedPrice = artwork.discount ? artwork.price - (artwork.price * artwork.discount) / 100 : artwork.price

  return (
    <Link href={`/artwork/${artwork.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {artwork.discount && (
              <Badge className="absolute top-3 right-3 bg-destructive">{artwork.discount}% OFF</Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 space-y-2">
          <h3 className="font-semibold text-lg">{artwork.title}</h3>
          <div className="flex items-center gap-2">
            {artwork.discount ? (
              <>
                <span className="text-lg font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">${artwork.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">${artwork.price.toFixed(2)}</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
