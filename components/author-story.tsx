import Image from "next/image"
import { MessageCircle, Instagram, Music2, Facebook, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthorStory() {
  return (
    <section className="py-12" id="historia">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-border/50 bg-card/30 p-6 md:p-10">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
            {/* Author Image */}
            <div className="relative">
              <div className="relative h-64 w-64 overflow-hidden rounded-2xl border-2 border-primary/50 shadow-xl shadow-primary/20">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cZlcZaDaJ8gnvCst1acCXUbH771m9R.png"
                  alt="Keissy Nicole"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                <span className="text-2xl">👑</span>
                <h2 className="text-2xl font-bold tracking-wide text-foreground">
                  Historia de Keissy
                </h2>
              </div>
              
              <p className="mb-4 text-sm text-primary">
                Escritora - Sonadora - Creadora de Mundos
              </p>
              
              <p className="mb-4 leading-relaxed text-muted-foreground">
                Desde pequena, las historias han sido mi refugio y mi poder. 
                Escribo sobre brujas, vampiros, demonios y mundos donde la magia 
                y la oscuridad se entrelazan con el amor y el destino.
              </p>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                Cada libro es un pedazo de mi alma, creado para que tu tambien 
                encuentres tu magia entre sus paginas.
              </p>
              <blockquote className="mb-6 border-l-2 border-primary pl-4 italic text-primary/90">
                {"La magia no esta en los libros, esta en quienes se atreven a sonar."}
                <span className="mt-2 block text-sm not-italic text-muted-foreground">
                  — Keissy Nicole
                </span>
              </blockquote>
            </div>

            {/* Chat & Social */}
            <div className="flex flex-col items-center gap-6">
              <Button className="gap-2 rounded-full bg-primary px-6 py-6 font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90">
                <MessageCircle className="h-5 w-5" />
                Chat de brujas ✨
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Únete a nuestra comunidad mágica
              </p>
              <div className="flex gap-3">
                <SocialButton icon={Instagram} href="#" />
                <SocialButton icon={Music2} href="#" />
                <SocialButton icon={Facebook} href="#" />
                <SocialButton icon={Pin} href="#" />
                <SocialButton icon={YoutubeIcon} href="#" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialButton({ icon: Icon, href }: { icon: React.ElementType; href: string }) {
  return (
    <a
      href={href}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-secondary text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
    >
      <Icon className="h-5 w-5" />
    </a>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}
