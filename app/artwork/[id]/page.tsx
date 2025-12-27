"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { getArtworkById } from "@/lib/artworks-data"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()
  const artwork = getArtworkById(id)

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artwork not found</h1>
            <Button onClick={() => router.push("/gallery")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const discountedPrice = artwork.discount ? artwork.price - (artwork.price * artwork.discount) / 100 : artwork.price

  const handleAddToCart = () => {
    addItem(artwork)
    toast({
      title: "Added to cart",
      description: `${artwork.title} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                fill
                className="object-cover"
                priority
              />
              {artwork.discount && (
                <Badge className="absolute top-4 right-4 bg-destructive text-lg px-4 py-2">
                  {artwork.discount}% OFF
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{artwork.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">{artwork.description}</p>
              </div>

              <div className="border-t border-b border-border py-6 space-y-4">
                <div className="flex items-baseline gap-3">
                  {artwork.discount ? (
                    <>
                      <span className="text-3xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                      <span className="text-xl text-muted-foreground line-through">${artwork.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary">${artwork.price.toFixed(2)}</span>
                  )}
                </div>

                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Original artwork, signed by the artist</p>
                <p>• Free shipping on all orders</p>
                <p>• 30-day return policy</p>
                <p>• Certificate of authenticity included</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
