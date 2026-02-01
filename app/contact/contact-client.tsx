"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone } from "lucide-react"
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

  // ✅ derived suggestions (no setState in effect)
  const suggestedSubject = useMemo(() => {
    if (!artworkSlug) return ""
    return `Inquiry: ${artwork?.title ?? artworkSlug}`
  }, [artworkSlug, artwork])

  const suggestedMessage = useMemo(() => {
    if (!artworkSlug) return ""
    return `Hello PRAVEE Arts,\n\nI’m interested in the artwork: ${
      artwork?.title ?? artworkSlug
    }\n\nCould you please share details about availability, dimensions, medium, and price?\n\nThank you!`
  }, [artworkSlug, artwork])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Milestone 9: store inquiries in DB / send email
    await new Promise((resolve) => setTimeout(resolve, 700))

    toast({
      title: "Message received!",
      description: "Thanks for reaching out. I’ll get back to you as soon as possible.",
    })

    setIsSubmitting(false)

    // reset fields (fallback suggestions will show again)
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact PRAVEE Arts</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Interested in an artwork, a commission, or an installation project? Send a message and include any
                details (size, medium, deadline, budget) to help me respond faster.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {artworkSlug ? (
                    <div className="mb-5 rounded-lg border bg-muted/30 p-4">
                      <div className="text-sm font-medium">Regarding</div>
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
                        <Link href={`/artwork/${encodeURIComponent(artworkSlug)}`} className="text-sm hover:underline">
                          View artwork →
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Artwork inquiry / Commission / Collaboration"
                        required
                        value={subject || suggestedSubject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell me what you’re looking for…"
                        rows={6}
                        required
                        value={message || suggestedMessage}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Tip: If you’re asking about a specific artwork, include the artwork name or paste the link.
                    </p>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">pravirughoobur@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">+1 (343) 843-0103</p>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground leading-relaxed pt-2">
                      Based in Canada. Available for commissions, collaborations, and exhibitions.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      I typically reply within <span className="text-foreground font-medium">24–48 hours</span>.
                    </p>
                    <p>
                      For urgent requests, please mention <span className="text-foreground font-medium">“Urgent”</span>{" "}
                      in the subject.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
