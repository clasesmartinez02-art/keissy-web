"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface GalleryImage {
  id: string
  title: string
  image_url: string
}

const defaultImages = [
  { id: "1", title: "Bruja mistica", image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop" },
  { id: "2", title: "Castillo oscuro", image_url: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=300&fit=crop" },
  { id: "3", title: "Libro magico", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" },
  { id: "4", title: "Velas y rituales", image_url: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&h=300&fit=crop" },
  { id: "5", title: "Luna llena", image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
  { id: "6", title: "Bosque encantado", image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=300&fit=crop" },
]

export function MysticGallery() {
  const [images, setImages] = useState<GalleryImage[]>(defaultImages)
  const supabase = createClient()

  useEffect(() => {
    async function fetchImages() {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6)

      if (data && data.length > 0) {
        setImages(data)
      }
    }
    fetchImages()
  }, [])

  return (
    <section className="py-12" id="galeria">
      <div className="container mx-auto px-4">
        <h2 className="sparkle mb-10 text-center font-serif text-2xl font-bold tracking-wider text-foreground">
          Galeria Mistica
        </h2>
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {images.map((image) => (
            <Link href="/galeria" key={image.id}>
              <div className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 transition-all hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20">
                <Image
                  src={image.image_url}
                  alt={image.title || "Imagen de galeria"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/galeria">
            <Button className="gap-2 rounded-full bg-primary px-8 py-6 font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90">
              <Sparkles className="h-4 w-4" />
              Subir Nueva Imagen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
