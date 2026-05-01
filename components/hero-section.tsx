"use client"

import { Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fondo-keissy-ifnQ2scQWA6n8oskMTSFxLILjvUH5F.png')`,
        }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto flex min-h-[80vh] items-center px-4 py-20">
        <div className="max-w-xl">
          {/* Welcome text */}
          <p className="mb-2 font-serif text-lg tracking-widest text-muted-foreground">
            BIENVENIDOS A MI
          </p>
          
          {/* Main title */}
          <h1 className="mb-2 font-serif text-2xl italic text-primary/80 md:text-3xl">
            Mundo de
          </h1>
          
          <div className="mb-6 flex items-center gap-4">
            <span className="text-primary">&#x2014;</span>
            <h2 className="font-display text-5xl font-bold tracking-wider text-foreground md:text-7xl">
              KEISSY
            </h2>
          </div>
          
          <div className="mb-8 flex items-center gap-4">
            <span className="text-primary">&#x2014;</span>
            <h2 className="font-display text-4xl font-light tracking-[0.3em] text-foreground/90 md:text-5xl">
              NICOLE
            </h2>
            <span className="text-primary">&#x2014;</span>
          </div>

          {/* Tagline */}
          <p className="mb-8 max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">
            Donde la magia, la oscuridad y la fantasía se convierten en historias inolvidables.
          </p>

          {/* CTA Button */}
          <Link href="/libros">
            <Button 
              size="lg" 
              className="group gap-2 rounded-full bg-primary px-8 py-6 text-lg font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            >
              <Moon className="h-5 w-5 transition-transform group-hover:rotate-12" />
              EXPLORAR MI MUNDO
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 text-primary/60">
          <span className="text-xs">&#x2726;</span>
          <span className="text-xs">&#x2726;</span>
          <span className="text-xs">&#x2726;</span>
        </div>
      </div>
    </section>
  )
}
