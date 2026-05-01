"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Serie {
  id: string
  title: string
  icon: string
  tags: string[]
}

const defaultSeries = [
  { id: "1", title: "Supernatural", icon: "👻", tags: ["Cazadores", "Oscuridad", "Misterio"] },
  { id: "2", title: "Lucifer", icon: "😈", tags: ["Demonio", "Crimen", "Romance"] },
  { id: "3", title: "Charmed", icon: "🔮", tags: ["Brujas", "Poderes", "Hermanas"] },
  { id: "4", title: "Shadowhunters", icon: "⚔️", tags: ["Cazadores", "Magia", "Acción"] },
  { id: "5", title: "Sabrina", icon: "🧙‍♀️", tags: ["Bruja", "Oscuridad", "Misterio"] },
  { id: "6", title: "The Vampire Diaries", icon: "🧛", tags: ["Vampiros", "Romance", "Drama"] },
]

export function SeriesGrid() {
  const [series, setSeries] = useState<Serie[]>(defaultSeries)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSeries() {
      const { data } = await supabase
        .from("series")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6)

      if (data && data.length > 0) {
        setSeries(data.map(s => ({
          id: s.id,
          title: s.title,
          icon: s.icon || "🎬",
          tags: s.tags || []
        })))
      }
    }
    fetchSeries()
  }, [])

  return (
    <section className="py-12" id="series">
      <div className="container mx-auto px-4">
        <h2 className="sparkle mb-10 text-center font-serif text-2xl font-bold tracking-wider text-foreground">
          Series Destacadas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {series.map((serie) => (
            <Link href="/series" key={serie.id}>
              <div className="group relative flex flex-col items-center rounded-xl border border-border/50 bg-card/30 p-6 transition-all hover:border-primary/70 hover:bg-card/60 hover:shadow-xl hover:shadow-primary/20">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-4xl transition-transform group-hover:scale-110">
                  {serie.icon}
                </div>
                <h3 className="mb-2 text-center font-serif font-semibold text-foreground">{serie.title}</h3>
                <p className="text-center text-xs text-muted-foreground">
                  {serie.tags.join(" · ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
