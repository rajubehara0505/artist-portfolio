import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArtworkCard } from "@/components/artwork-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/ssr"

export default async function Home() {
  const supabase = await getSupabaseServerClient()

  const { data: featuredArtworks, error } = await supabase
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
    .eq("featured", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .order("sort_order", { referencedTable: "product_images", ascending: true })

  if (error) {
    console.error("Failed to load featured artworks:", error.message)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-balance">
              PRAVEE Arts
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Original mixed media artworks and immersive installations—crafted with texture, contrast, and story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/gallery">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Inquire / Contact</Link>
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
                A curated selection of featured pieces currently published in the collection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {(featuredArtworks ?? []).map((artwork: any) => (
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

        {/* Artist Bio Section (REAL, not dummy) */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/PraveePhoto.jpeg"
                alt="PRAVEE Arts - Artist Portrait"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">About the Artist</h2>

              <p className="text-muted-foreground leading-relaxed">
                I’m a visual artist with 19+ years of experience in Arts &amp; Design, showcasing my work internationally
                and presenting a solo exhibition at the Ottawa Little Theatre, Canada.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                My practice centers on mixed media—layering materials, building textures, and creating pieces that invite
                exploration. I also create installation art that transforms ideas into immersive, sensory experiences.
              </p>

              <Button asChild>
                <Link href="/about">Read Full Story</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
