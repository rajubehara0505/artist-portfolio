import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageFade } from "@/components/page-fade"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Award, Palette, Trees } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-20">
        <PageFade>
          <section className="py-14 md:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-3xl text-center">
                  <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    About the Artist
                  </p>
                  <h2 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight">
                    A life shaped by texture, nature, and imagination
                  </h2>
                  <p className="mt-6 text-muted-foreground leading-relaxed md:text-lg">
                    Discover the story, influences, and artistic philosophy behind
                    PRAVEE Arts.
                  </p>
                </div>

                <div className="mt-12 grid gap-8 md:mt-14 md:grid-cols-[1.02fr_0.98fr] md:items-center md:gap-10">
                  <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src="/solo.jpeg"
                        alt="PRAVEE Arts – Artist Portrait"
                        fill
                        priority
                        sizes="(max-width: 700px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-5 md:space-y-6">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      PRAVEE Arts
                    </p>

                    <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight">
                      Visual artist with over 19 years of experience in Arts &amp; Design
                    </h2>

                    <p className="text-muted-foreground leading-relaxed md:text-lg">
                      I am a visual artist with over 19 years of experience in Arts &amp; Design,
                      showcasing my work internationally and one solo art exhibition at the
                      Ottawa Little Theatre, Canada and earning awards such as the People’s
                      Choice Award and Man of the Year in Arts &amp; Culture.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="gallery-frame p-5">
                        <Award className="h-5 w-5 text-muted-foreground" />
                        <p className="mt-3 font-medium">Awards & Recognition</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          People’s Choice Award and Man of the Year in Arts &amp; Culture.
                        </p>
                      </div>

                      <div className="gallery-frame p-5">
                        <Palette className="h-5 w-5 text-muted-foreground" />
                        <p className="mt-3 font-medium">Practice</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          Mixed media, texture-based experimentation, and immersive installation work.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-14 md:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <div className="mb-10">
                  <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    Journey
                  </p>
                  <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight">
                    The path into art
                  </h2>
                </div>

                <div className="space-y-6 text-muted-foreground leading-8 md:text-lg">
                  <p>
                    My journey in the arts began at the University of Technology of Mauritius,
                    where I immersed myself in graphic design and animation. From mastering
                    the brushstrokes of traditional art to exploring the limitless dimensions
                    of digital artistry and 3D animation, I discovered the magic of bringing
                    ideas to life.
                  </p>

                  <p>
                    As a fresh face in Canada, I had the exhilarating chance to step into the
                    spotlight at the Ottawa Art Battle. Competing among talented artists, I
                    painted my way to the final rounds, an experience that marked a vibrant
                    beginning to my creative journey here and won the battle that night.
                  </p>

                  <p>
                    Creativity is the heartbeat of my passion, woven intricately into the
                    personal journey of every artistic endeavor I take. From the time I was
                    just a little boy, the spark of imagination captivated me, turning even
                    the simplest moments into opportunities for creation and self-expression.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-14 md:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
                <div className="gallery-frame p-8">
                  <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    Medium & Practice
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
                    Mixed media as storytelling
                  </h3>
                  <p className="mt-5 text-muted-foreground leading-relaxed">
                    My favorite medium is mixed media, where textures, forms, and shapes
                    come together to tell a story. I love experimenting, layering materials,
                    playing with contrast, and building pieces that invite touch and exploration.
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Over time, this passion grew into installation art, creating immersive
                    spaces where viewers can step into the heart of the artwork. For me,
                    it’s all about turning ideas into tangible, sensory experiences.
                  </p>
                </div>

                <div className="gallery-frame p-8">
                  <div className="flex items-start gap-3">
                    <Trees className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                        Inspiration
                      </p>
                      <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
                        Nature, memory, and inherited creativity
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 text-muted-foreground leading-relaxed">
                    My art finds its soul in the beauty and rhythm of nature, a source of
                    endless inspiration that I channel into my canvas and installation pieces.
                    Growing up surrounded by the Indian Ocean in a tropical paradise, I was
                    immersed in the rich textures and vibrant colors of the natural world,
                    a gift that deeply shaped my creative vision.
                  </p>

                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    But my journey into art wasn’t just inspired by the environment; it was
                    also rooted in watching my father’s hands at work. With incredible ingenuity,
                    he transformed scrap materials into captivating sculptures for the Holi
                    festival of Maha Shivaratri. His ability to breathe life into discarded
                    objects planted the seed of creativity in me, teaching me to see art in
                    everything and infuse emotion into every piece I create.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-14 md:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl rounded-[2rem] border border-border/70 bg-card px-5 py-8 shadow-sm md:px-10 md:py-12">
                <div className="text-center">
                  <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    Get in Touch
                  </p>
                  <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight">
                    Let’s start a conversation
                  </h2>
                  <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed md:text-lg">
                    For commissions, collaborations, exhibitions, or artwork inquiries,
                    feel free to reach out.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                  <div className="gallery-frame p-5">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-5 w-5" />
                      <span className="break-all">pravirughoobur@gmail.com</span>
                    </div>
                  </div>

                  <div className="gallery-frame p-5">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="h-5 w-5" />
                      <span>+1 (343) 843-0103</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/contact">Send a Message</Link>
                  </Button>
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