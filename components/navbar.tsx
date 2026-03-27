"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const isHomePage = pathname === "/"

  const useTransparentStyle = useMemo(() => {
    return isHomePage && !scrolled
  }, [isHomePage, scrolled])

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        useTransparentStyle
          ? "border-transparent bg-transparent"
          : "border-b border-border/60 bg-background/90 backdrop-blur-xl"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/branding/logonew.png"
              alt="PRAVEE Arts logo"
              width={160}
              height={60}
              className="h-auto w-[140px] object-contain md:w-[160px]"
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-[0.18em] transition-colors ${
                  useTransparentStyle
                    ? "text-white/90 hover:text-white"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu
                    className={`h-5 w-5 ${
                      useTransparentStyle ? "text-white" : "text-foreground"
                    }`}
                  />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[85%] sm:w-[380px]">
                <div className="mt-10 flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}