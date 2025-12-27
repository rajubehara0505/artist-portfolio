import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">About the Artist</h1>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img src="/professional-artist-portrait-studio-creative.jpg" alt="Artist Portrait" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">Jane Anderson</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Contemporary visual artist specializing in abstract and landscape paintings
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Born in Portland, Oregon • Based in San Francisco, California
                </p>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="max-w-3xl mx-auto space-y-6 mb-16">
            <h2 className="text-3xl font-serif font-bold mb-6">Biography</h2>
            <p className="text-muted-foreground leading-relaxed">
              Jane Anderson is a contemporary artist whose work explores the intersection of nature, emotion, and modern
              life. With over 15 years of professional experience, she has developed a distinctive style that combines
              traditional painting techniques with contemporary themes.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Her work has been featured in numerous galleries across the United States, including exhibitions in New
              York, Los Angeles, and San Francisco. Jane's paintings are held in private collections worldwide and have
              been recognized for their unique ability to evoke emotional responses while maintaining aesthetic
              sophistication.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Drawing inspiration from natural landscapes, urban environments, and human experiences, Jane creates
              pieces that invite viewers to pause and reflect. Each artwork is meticulously crafted with attention to
              color, texture, and composition, resulting in pieces that are both visually striking and emotionally
              resonant.
            </p>
          </div>

          {/* Education & Awards */}
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
            <div>
              <h3 className="text-xl font-semibold mb-4">Education</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• MFA in Fine Arts, Rhode Island School of Design</li>
                <li>• BFA in Painting, San Francisco Art Institute</li>
                <li>• Study Abroad, École des Beaux-Arts, Paris</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Awards & Recognition</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Contemporary Art Award, 2022</li>
                <li>• Best Emerging Artist, 2019</li>
                <li>• Gallery of the Year Exhibition, 2018</li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="max-w-3xl mx-auto bg-muted/30 rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>contact@artisangallery.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>123 Art Street, San Francisco, CA 94102</span>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild>
                <Link href="/contact">Send a Message</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
