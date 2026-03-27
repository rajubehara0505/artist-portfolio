"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    image: "/hero/slide-1.jpeg",
    title: "Original Mixed Media Artworks",
    subtitle:
      "Layered with texture, emotion, and story — a curated visual experience by PRAVEE Arts.",
  },
  {
    id: 2,
    image: "/hero/slide-2.jpeg",
    title: "Immersive Visual Narratives",
    subtitle:
      "Discover expressive pieces shaped through color, material, and artistic exploration.",
  },
  {
    id: 3,
    image: "/hero/slide-3.jpeg",
    title: "Art for Collectors & Spaces",
    subtitle:
      "Browse featured works, explore the gallery, and inquire about originals or commissions.",
  },
  {
    id: 4,
    image: "/hero/slide-4.jpeg",
    title: "Art for Collectors & Spaces",
    subtitle:
      "Browse featured works, explore the gallery, and inquire about originals or commissions.",
  },
  
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  const total = slides.length

  const activeSlide = useMemo(() => slides[current], [current])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total)
      setIsAnimating(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true))
      })
    }, 5500)

    return () => clearInterval(interval)
  }, [total])

  const goToSlide = (index: number) => {
    setCurrent(index)
    setIsAnimating(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAnimating(true))
    })
  }

  const prevSlide = () => {
    goToSlide((current - 1 + total) % total)
  }

  const nextSlide = () => {
    goToSlide((current + 1) % total)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[78vh] min-h-[560px] w-full md:h-[88vh]">
        {slides.map((slide, index) => {
          const isActive = index === current

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0">
                {/* Background blurred image */}
                <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover blur-2xl scale-110 opacity-40"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Main centered artwork */}
                <div className="absolute inset-0 z-[1] flex items-center justify-center px-6">
                <div className="relative h-[55vh] w-full max-w-5xl md:h-[65vh]">
                    <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className={`object-contain drop-shadow-2xl transition-transform duration-[7000ms] ease-out ${
                        isActive ? "scale-100" : "scale-[1.03]"
                    }`}
                    />
                </div>
                </div>

              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.18)_100%)]" />
            </div>
          )
        })}

        <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
          <div className="max-w-4xl text-center text-white">
            <p
              className={`mb-4 text-xs uppercase tracking-[0.38em] text-white/80 transition-all duration-700 ease-out md:text-sm ${
                isAnimating
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              PRAVEE Arts
            </p>

            <h1
              className={`mx-auto max-w-4xl font-serif text-4xl leading-tight transition-all duration-700 delay-100 ease-out md:text-6xl lg:text-7xl ${
                isAnimating
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              {activeSlide.title}
            </h1>

            <p
              className={`mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/90 transition-all duration-700 delay-200 ease-out md:text-lg ${
                isAnimating
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              {activeSlide.subtitle}
            </p>

            <div
              className={`mt-8 flex flex-col items-center justify-center gap-4 transition-all duration-700 delay-300 ease-out sm:flex-row ${
                isAnimating
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-7 text-black hover:bg-white/90"
              >
                <Link href="/gallery">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/70 bg-transparent px-7 text-white hover:bg-white hover:text-black"
              >
                <Link href="/contact">Inquire / Contact</Link>
              </Button>
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                current === index ? "w-8 bg-white" : "w-2.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}