"use client"

import { Book, Heart, Star, Trophy } from "lucide-react"

const stats = [
  { icon: Book, label: "Libros leídos", value: "127", color: "text-purple-400" },
  { icon: Heart, label: "Favoritos", value: "23", color: "text-pink-400" },
  { icon: Star, label: "Reseñas", value: "45", color: "text-yellow-400" },
  { icon: Trophy, label: "Retos completados", value: "8", color: "text-emerald-400" },
]

export function ReadingStats() {
  return (
    <section className="border-y border-primary/20 bg-secondary/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className={`rounded-full bg-background/50 p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="font-serif text-3xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
