import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageFade } from "@/components/page-fade"
import { ArtworkLightbox } from "@/components/artwork-lightbox"
import { getSupabaseServerClient } from "@/lib/supabase/ssr"

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  const { data: artwork, error } = await supabase
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
    .order("sort_order", { referencedTable: "product_images", ascending: true })
    .single()

  if (error || !artwork) {
    notFound()
  }

  const images = artwork.product_images ?? []
  const price =
    artwork.price_cents != null
      ? ((artwork.price_cents ?? 0) / 100).toFixed(2)
      : null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-20">
        <PageFade>
          <section className="border-b border-border/60 bg-muted/20 py-10 md:py-14">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full px-0 hover:bg-transparent"
                >
                  <Link href="/gallery" className="inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Gallery
                  </Link>
                </Button>

                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Artwork Detail
                </p>
              </div>
            </div>
          </section>
        </PageFade>

        <section className="py-12 md:py-18">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <PageFade>
                <ArtworkLightbox images={images} title={artwork.title} />
              </PageFade>

              <PageFade>
                <div className="lg:sticky lg:top-28">
                  <div className="gallery-frame p-5 md:p-8">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      PRAVEE Arts
                    </p>

                    <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
                      {artwork.title}
                    </h1>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {artwork.featured && (
                        <span className="rounded-full border border-border/70 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Featured
                        </span>
                      )}

                      <span className="rounded-full border border-border/70 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Original Work
                      </span>
                    </div>

                    <div className="mt-8">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        Price
                      </p>
                      <p className="mt-2 font-serif text-3xl">
                        {price ? `$${price} ${artwork.currency ?? "CAD"}` : "Price on request"}
                      </p>
                    </div>

                    <div className="mt-8">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        Description
                      </p>
                      <p className="mt-3 leading-relaxed text-muted-foreground md:text-lg">
                        {artwork.description?.trim()
                          ? artwork.description
                          : "This artwork is part of the artist’s curated collection, created through material exploration, texture, and visual storytelling."}
                      </p>
                    </div>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full px-8 transition-all duration-300 hover:scale-[1.03]"
                      >
                        <Link href={`/contact?artwork=${artwork.slug}`}>
                          Inquire About This Piece
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8 transition-all duration-300 hover:scale-[1.03]"
                      >
                        <Link href="/gallery">View More Works</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-5 gallery-frame p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Collector Note
                    </p>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      For commissions, framing questions, availability, or purchase-related
                      inquiries, please reach out through the contact page.
                    </p>
                  </div>
                </div>
              </PageFade>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}