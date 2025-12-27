import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArtworkCard } from "@/components/artwork-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getFeaturedArtworks } from "@/lib/artworks-data"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const featuredArtworks = getFeaturedArtworks()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-balance">
              Contemporary Art That Speaks to Your Soul
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Discover unique artworks created with passion and dedication. Each piece tells a story waiting to become
              part of yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/gallery">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">About the Artist</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Artworks */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Artworks</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A curated selection of our most popular pieces
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link href="/gallery">View All Artworks</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Artist Bio Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img src="/artist-portrait-studio-workspace.jpg" alt="Artist" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">About the Artist</h2>
              <p className="text-muted-foreground leading-relaxed">
                With over 15 years of experience in contemporary art, I create pieces that blend traditional techniques
                with modern sensibilities. Each artwork is a journey of exploration, emotion, and expression.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                My work has been featured in galleries across the country, and I'm passionate about making art
                accessible to collectors and enthusiasts alike.
              </p>
              <Button asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
