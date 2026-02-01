import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">
              About the Artist
            </h1>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                <Image
                  src="/PraveePhoto.jpeg"
                  alt="PRAVEE Arts – Artist Portrait"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">PRAVEE Arts</h2>

                <p className="text-muted-foreground leading-relaxed">
                  Visual artist with over <strong>19 years of experience</strong> in Arts &amp; Design,
                  showcasing work internationally and presenting a solo exhibition at the
                  Ottawa Little Theatre, Canada.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Recipient of awards including the <strong>People’s Choice Award</strong> and
                  <strong> Man of the Year in Arts &amp; Culture</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="max-w-3xl mx-auto space-y-6 mb-16">
            <h2 className="text-3xl font-serif font-bold mb-6">Biography</h2>

            <p className="text-muted-foreground leading-relaxed">
              I am a visual artist with over 19 years of experience in Arts &amp; Design, showcasing my work
              internationally and presenting a solo art exhibition at the Ottawa Little Theatre, Canada.
              My artistic journey has been recognized with awards such as the People’s Choice Award and
              Man of the Year in Arts &amp; Culture.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              My journey in the arts began at the University of Technology of Mauritius, where I immersed
              myself in graphic design and animation. From mastering traditional art techniques to
              exploring digital artistry and 3D animation, I discovered the power of bringing ideas to life.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              As a fresh face in Canada, I had the exhilarating opportunity to compete in the Ottawa Art
              Battle. Painting among talented artists, I reached the final rounds and won the battle that
              night—marking a vibrant beginning to my creative journey here.
            </p>
          </div>

          {/* Artist Statement */}
          <div className="max-w-3xl mx-auto space-y-6 mb-16">
            <h2 className="text-3xl font-serif font-bold mb-6">Artist Statement</h2>

            <p className="text-muted-foreground leading-relaxed">
              Creativity is the heartbeat of my passion. From childhood, imagination transformed even the
              simplest moments into opportunities for creation and self-expression. Every artwork I create
              carries a personal journey woven into its form.
            </p>

            <h3 className="text-xl font-semibold mt-8">Medium &amp; Practice</h3>
            <p className="text-muted-foreground leading-relaxed">
              My primary medium is mixed media, where textures, forms, and shapes come together to tell a
              story. I love experimenting—layering materials, playing with contrast, and creating pieces
              that invite touch and exploration. This passion evolved into installation art, creating
              immersive spaces where viewers can step into the artwork itself.
            </p>

            <h3 className="text-xl font-semibold mt-8">Inspiration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Nature is the soul of my work. Growing up surrounded by the Indian Ocean in a tropical
              paradise, I was immersed in vibrant colors and organic textures that deeply shaped my
              creative vision.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              My artistic roots were also shaped by watching my father transform scrap materials into
              sculptures for the Holi festival of Maha Shivaratri. His ingenuity taught me to see art in
              everything and to infuse emotion into every piece I create.
            </p>
          </div>

          {/* Contact Info */}
          <div className="max-w-3xl mx-auto bg-muted/30 rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold mb-6">Get in Touch</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>pravirughoobur@gmail.com</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span>+1 (343) 843-0103</span>
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
