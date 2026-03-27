"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSplit() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[72vh] px-4 pt-28 pb-16 md:min-h-[78vh] md:px-6 md:pt-32">
        {/* Soft ambient background */}
        <div className="absolute inset-0">
        <Image
            src="/hero/slide-1new.jpeg"
            alt="Ambient artwork background"
            fill
            priority
            sizes="100vw"
            className="object-cover blur-3xl scale-110 opacity-22"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(255,170,70,0.16),transparent_22%),radial-gradient(circle_at_68%_34%,rgba(80,120,255,0.12),transparent_28%),linear-gradient(to_bottom,rgba(0,0,0,0.04),rgba(0,0,0,0.08))]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_0.95fr] md:gap-14">
          {/* Left content */}
          <div className="max-w-xl text-center md:text-left">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/65">
              PRAVEE Arts
            </p>

            <h1 className="font-serif text-4xl leading-tight text-white/85 md:text-6xl">
              Art shaped by texture, memory, and emotion
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 md:text-lg md:max-w-xl">
              Original mixed media artworks and immersive visual storytelling.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white/90 px-7 text-black transition-all duration-300 hover:scale-[1.03] hover:bg-white"
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
                className="rounded-full border-white/60 bg-transparent px-7 text-white/85 transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-black"
              >
                <Link href="/about">About the Artist</Link>
              </Button>
            </div>
          </div>

          {/* Right artwork */}
          <div className="relative flex justify-center md:justify-end">
            <div className="absolute right-1/2 top-1/2 h-[260px] w-[260px] -translate-y-1/2 translate-x-1/2 rounded-full bg-amber-200/12 blur-3xl md:right-[20%] md:h-[320px] md:w-[320px]" />
            <div className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px]">
              <div className="rounded-[1.75rem] border border-white/12 bg-white/10 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-md md:p-5">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-white/5">
                  <Image
                    src="/hero/slide-1new.jpeg"
                    alt="Featured portrait artwork"
                    fill
                    priority
                    sizes="(max-width: 768px) 85vw, 40vw"
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.28)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}