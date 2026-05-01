import Link from "next/link"

const quickAccessItems = [
  {
    emoji: "📚",
    title: "Ver todos los libros",
    description: "Explora toda mi colección",
    href: "/libros",
  },
  {
    emoji: "🎬",
    title: "Ver todas las series",
    description: "Descubre mis sagas y trilogías",
    href: "/series",
  },
  {
    emoji: "🖼️",
    title: "Ver toda la galería",
    description: "Ilustraciones y arte exclusivo",
    href: "/galeria",
  },
]

export function QuickAccess() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccessItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center justify-center gap-3 rounded-xl border border-primary/30 bg-card/30 backdrop-blur-sm p-5 transition-all hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex flex-col">
                <span className="font-serif font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors uppercase text-sm">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
