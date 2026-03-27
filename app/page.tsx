import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSplit } from "@/components/hero-split"
import { ArtworkCard } from "@/components/artwork-card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { PageFade } from "@/components/page-fade"
import { getSupabaseServerClient } from "@/lib/supabase/ssr"

export default async function HomePage() {
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSplit />

        <PageFade>
          <div className="pt-20">
            <ScrollReveal>
              <section className="py-16 md:py-28">
                <div className="container mx-auto px-4">
                  <div className="mx-auto max-w-3xl text-center">
                    <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      Featured Collection
                    </p>
                    <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight">
                      Selected Works
                    </h2>
                    <p className="mt-5 text-muted-foreground leading-relaxed md:text-lg">
                      A curated selection of published artworks that reflect texture,
                      movement, emotion, and visual storytelling.
                    </p>
                  </div>

                  <div className="mt-12 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-8">
                    {(featuredArtworks ?? []).map((artwork: any) => (
                      <ArtworkCard key={artwork.id} artwork={artwork} />
                    ))}
                  </div>

                  <div className="mt-12 text-center">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full px-7 transition-all duration-300 hover:scale-[1.03]"
                    >
                      <Link href="/gallery">
                        View Full Gallery
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <section className="border-y border-border/60 bg-muted/20 py-16 md:py-28">
                <div className="container mx-auto px-4">
                  <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12">
                    <div className="relative overflow-hidden rounded-[2rem] bg-muted shadow-sm">
                      <div className="relative aspect-[5/4]">
                        <Image
                          src="/solo.jpeg"
                          alt="Portrait of the artist"
                          fill
                          sizes="(max-width: 768px) 50vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-5 md:space-y-6">
                      <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                        About the Artist
                      </p>

                      <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight">
                        Creating art through texture, form, and emotion
                      </h2>

                      <p className="text-muted-foreground leading-relaxed md:text-lg">
                        PRAVEE Arts explores mixed media, layered surfaces, and immersive
                        visual storytelling. Each piece is designed to hold presence,
                        invite reflection, and connect viewers with material, memory, and nature.
                      </p>

                      <p className="text-muted-foreground leading-relaxed md:text-lg">
                        With international exhibition experience and a strong passion for
                        experimentation, the practice moves between canvas, installation,
                        and sensory expression.
                      </p>

                      <Button
                        asChild
                        className="rounded-full px-7 transition-all duration-300 hover:scale-[1.03]"
                      >
                        <Link href="/about">Read More</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <section className="py-14 md:py-24">
                <div className="container mx-auto px-4">
                  <div className="mx-auto max-w-4xl rounded-[2rem] border border-border/70 bg-card px-6 py-12 text-center shadow-sm md:px-12">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      Inquiries & Commissions
                    </p>

                    <h2 className="mt-4 font-serif text-3xl md:text-5xl font-semibold tracking-tight">
                      Looking for an original piece or commission?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed md:text-lg">
                      For commissions, pricing, availability, collaborations, or exhibition
                      inquiries, get in touch to begin the conversation.
                    </p>

                    <div className="mt-8">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full px-8 transition-all duration-300 hover:scale-[1.03]"
                      >
                        <Link href="/contact">Contact the Artist</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          </div>
        </PageFade>
      </main>

      <Footer />
    </div>
  )
}