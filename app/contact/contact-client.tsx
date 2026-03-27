"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { PageFade } from "@/components/page-fade"
import {
  Mail,
  Phone,
  Instagram,
  Facebook,
  MapPin,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

type ProductLite = { title: string; slug: string }

export default function ContactClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const artworkSlug = useMemo(() => {
    const raw = searchParams.get("artwork")
    return raw ? raw.trim() : ""
  }, [searchParams])

  const [artwork, setArtwork] = useState<ProductLite | null>(null)
  const [loadingArtwork, setLoadingArtwork] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const defaultSubject = "General inquiry"
  const defaultMessage = "Hello PRAVEE Arts,\n\nI’d like to get in touch.\n\nThank you!"

  useEffect(() => {
    let cancelled = false

    async function loadArtwork() {
      if (!artworkSlug) {
        setArtwork(null)
        return
      }

      setLoadingArtwork(true)
      const supabase = getSupabaseBrowserClient()

      const { data, error } = await supabase
        .from("products")
        .select("title,slug")
        .eq("slug", artworkSlug)
        .maybeSingle()

      if (cancelled) return

      if (error || !data) {
        setArtwork(null)
      } else {
        setArtwork({ title: data.title, slug: data.slug })
      }

      setLoadingArtwork(false)
    }

    loadArtwork()

    return () => {
      cancelled = true
    }
  }, [artworkSlug])

  const suggestedSubject = useMemo(() => {
    if (artworkSlug) return `Inquiry: ${artwork?.title ?? artworkSlug}`
    return defaultSubject
  }, [artworkSlug, artwork])

  const suggestedMessage = useMemo(() => {
    if (artworkSlug) {
      return `Hello PRAVEE Arts,\n\nI’m interested in the artwork: ${
        artwork?.title ?? artworkSlug
      }\n\nCould you please share details about availability, dimensions, medium, and price?\n\nThank you!`
    }
    return defaultMessage
  }, [artworkSlug, artwork])

  useEffect(() => {
    setSubject((prev) => (prev.trim() ? prev : suggestedSubject))
    setMessage((prev) => (prev.trim() ? prev : suggestedMessage))
  }, [suggestedSubject, suggestedMessage])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const finalSubject =
      (subject && subject.trim()) ||
      (suggestedSubject && suggestedSubject.trim()) ||
      "General inquiry"

    const finalMessage =
      (message && message.trim()) ||
      (suggestedMessage && suggestedMessage.trim()) ||
      "Hello PRAVEE Arts,\n\nI’d like to get in touch.\n\nThank you!"

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: finalSubject,
          message: finalMessage,
          productTitle: artwork?.title ?? "",
          productSlug: artwork?.slug ?? artworkSlug ?? "",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error ?? `Request failed (${res.status})`)
      }

      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I’ll get back to you as soon as possible.",
      })

      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err: any) {
      toast({
        title: "Sending failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-20">
        <PageFade>
          <section className="border-b border-border/60 bg-muted/20 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl text-center">
                <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                  Contact
                </p>
                <h1 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight">
                  Let’s begin a conversation
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed md:text-lg">
                  For commissions, original artwork inquiries, collaborations, or exhibitions,
                  get in touch and I’ll be happy to connect with you.
                </p>
              </div>
            </div>
          </section>

          <section className="py-14 md:py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto grid max-w-6xl gap-6 md:gap-8 md:grid-cols-[1.1fr_0.9fr]">
                <div className="gallery-frame p-5 md:p-8">
                  <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    Send a Message
                  </p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                    Inquiry Form
                  </h2>
                  <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                    Share a few details about your interest, and I’ll get back to you regarding
                    availability, pricing, commissions, or collaborations.
                  </p>

                  {artworkSlug ? (
                    <div className="mt-6 rounded-[1.25rem] border border-border/70 bg-muted/30 p-4">
                      <div className="text-sm font-medium text-foreground">Regarding</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {loadingArtwork ? (
                          "Loading artwork…"
                        ) : artwork ? (
                          <>
                            <span className="font-medium text-foreground">{artwork.title}</span>{" "}
                            <span className="text-xs">({artwork.slug})</span>
                          </>
                        ) : (
                          <span className="font-medium text-foreground">{artworkSlug}</span>
                        )}
                      </div>
                      <div className="mt-2">
                        <Link
                          href={`/artwork/${encodeURIComponent(artworkSlug)}`}
                          className="text-sm transition hover:underline"
                        >
                          View artwork →
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12 rounded-2xl border-border/70 bg-background/80"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 rounded-2xl border-border/70 bg-background/80"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Artwork inquiry / Commission / Collaboration"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-12 rounded-2xl border-border/70 bg-background/80"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me what you’re looking for…"
                        required
                        rows={7}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[180px] rounded-2xl border-border/70 bg-background/80"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full px-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      Tip: If you’re asking about a specific artwork, include the artwork name or use
                      the inquiry button from that artwork page.
                    </p>
                  </form>
                </div>

                <div className="space-y-5 md:space-y-6">
                  <div className="gallery-frame p-5 md:p-8">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      Contact Details
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
                      Reach out directly
                    </h2>

                    <div className="mt-8 space-y-5 text-muted-foreground">
                      <div className="flex items-start gap-4">
                        <Mail className="mt-1 h-5 w-5" />
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em]">Email</p>
                          <p className="mt-1 break-all">pravirughoobur@gmail.com</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Phone className="mt-1 h-5 w-5" />
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em]">Phone</p>
                          <p className="mt-1">+1 (343) 843-0103</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <MapPin className="mt-1 h-5 w-5" />
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em]">Location</p>
                          <p className="mt-1">Ottawa, Canada</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="gallery-frame p-5 md:p-8">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      Social
                    </p>
                    <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
                      Follow the journey
                    </h3>

                    <div className="mt-6 flex items-center gap-4">
                      <Link
                        href="https://www.instagram.com/praveerughoobur?igsh=MWgyMDVoYXU0eXM3YQ=="
                        className="rounded-full border border-border/70 p-3 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        <Instagram className="h-5 w-5" />
                      </Link>

                      <Link
                        href="https://www.facebook.com/share/1cJ9AvetVy/"
                        className="rounded-full border border-border/70 p-3 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        <Facebook className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  <div className="gallery-frame p-5 md:p-8">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      Response Time
                    </p>
                    <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
                      Usually within 24–48 hours
                    </h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      For urgent requests, mention “Urgent” in the subject line.
                    </p>

                    <div className="mt-6">
                      <Button asChild variant="outline" className="rounded-full px-6">
                        <Link href="/gallery">View Gallery</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </PageFade>  
      </main>

      <Footer />
    </div>
  )
}