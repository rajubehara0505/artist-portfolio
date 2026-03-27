"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type ArtworkImage = {
  id: string
  path: string
  alt: string | null
}

type ArtworkLightboxProps = {
  images: ArtworkImage[]
  title: string
}

function toPublicImageUrl(path: string) {
  if (!path) return ""
  if (path.startsWith("http")) return path

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/artworks/${path}`
}

export function ArtworkLightbox({ images, title }: ArtworkLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!images?.length) return null

  const open = (index: number) => setActiveIndex(index)
  const close = () => setActiveIndex(null)

  const prev = () => {
    if (activeIndex === null) return
    setActiveIndex((activeIndex - 1 + images.length) % images.length)
  }

  const next = () => {
    if (activeIndex === null) return
    setActiveIndex((activeIndex + 1) % images.length)
  }

  return (
    <>
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => open(0)}
          className="gallery-frame block w-full overflow-hidden text-left"
        >
          <div className="relative aspect-[4/5] bg-muted">
            <Image
              src={toPublicImageUrl(images[0].path)}
              alt={images[0].alt ?? title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.slice(1).map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => open(index + 1)}
                className="gallery-frame block overflow-hidden text-left"
              >
                <div className="relative aspect-[4/5] bg-muted">
                  <Image
                    src={toPublicImageUrl(image.path)}
                    alt={image.alt ?? title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/92">
          <button
            type="button"
            onClick={close}
            aria-label="Close lightbox"
            className="absolute right-5 top-5 z-[110] rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-5 top-1/2 z-[110] -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-5 top-1/2 z-[110] -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="flex h-full items-center justify-center px-6 py-16">
            <div className="relative h-full w-full max-w-6xl">
              <Image
                src={toPublicImageUrl(images[activeIndex].path)}
                alt={images[activeIndex].alt ?? title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}