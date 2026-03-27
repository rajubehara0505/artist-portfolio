import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArtworkCard } from "@/components/artwork-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { PageFade } from "@/components/page-fade"
import { getSupabaseServerClient } from "@/lib/supabase/ssr"

export default async function GalleryPage() {
  const supabase = await getSupabaseServerClient()

  const { data: artworks, error } = await supabase
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
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .order("sort_order", { referencedTable: "product_images", ascending: true })

  if (error) {
    console.error("Failed to load gallery artworks:", error.message)
  }

  const allArtworks = artworks ?? []
  const featuredCount = allArtworks.filter((item: any) => item.featured).length

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-20">
        <PageFade>
          <ScrollReveal>
            <section className="border-b border-border/60 bg-muted/20 py-14 md:py-24">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl text-center">
                  <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    Gallery
                  </p>

                  <h1 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight">
                    A curated collection of original works
                  </h1>

                  <p className="mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed md:text-lg">
                    Explore published artworks shaped through texture, contrast,
                    material, and visual storytelling.
                  </p>
                </div>

                <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3">
                  <div className="gallery-frame p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Total Works
                    </p>
                    <p className="mt-2 font-serif text-3xl">{allArtworks.length}</p>
                  </div>

                  <div className="gallery-frame p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Featured
                    </p>
                    <p className="mt-2 font-serif text-3xl">{featuredCount}</p>
                  </div>

                  <div className="gallery-frame p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Status
                    </p>
                    <p className="mt-2 font-serif text-3xl">Live</p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={100}>

            <section className="py-14 md:py-16">
              <div className="container mx-auto px-4">
                {allArtworks.length === 0 ? (
                  <div className="mx-auto max-w-2xl rounded-[2rem] border border-border/60 bg-card px-5 py-10 text-center shadow-sm md:px-6 md:py-14">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      Gallery
                    </p>
                    <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight">
                      No published artworks yet
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      Your gallery is ready. Once artworks are published, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
                    {allArtworks.map((artwork: any) => (
                      <ArtworkCard key={artwork.id} artwork={artwork} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </ScrollReveal>
        </PageFade>  
      </main>

      <Footer />
    </div>
  )
}