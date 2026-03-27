import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              PRAVEE Arts
            </p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Original artworks, mixed media practice, commissions, and curated collections.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Navigation
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/gallery" className="transition-colors hover:text-foreground">
                Gallery
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
              <Link href="/contact" className="transition-colors hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Follow
            </p>
            <div className="mt-4 flex items-center gap-4">
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
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PRAVEE Arts. All rights reserved.
        </div>
      </div>
    </footer>
  )
}