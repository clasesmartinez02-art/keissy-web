"use client"

import { useState } from "react"

const categories = [
  { name: "Brujas", emoji: "🧙‍♀️", active: true },
  { name: "Vampiros", emoji: "🧛", active: false },
  { name: "Demonios", emoji: "👹", active: false },
  { name: "Fantasía", emoji: "✨", active: false },
]

export function CategoryButtons() {
  const [activeCategory, setActiveCategory] = useState("Brujas")

  return (
    <section className="py-8" id="libros">
      <div className="container mx-auto px-4">
        <h2 className="sparkle mb-8 text-center text-2xl font-bold tracking-wider text-foreground">
          LIBROS SOBRENATURALES
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
                activeCategory === category.name
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "border border-border/50 bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <span className="text-lg">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
