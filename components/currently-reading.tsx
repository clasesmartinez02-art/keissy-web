"use client"

import { Book, Clock } from "lucide-react"

const currentlyReading = [
  {
    title: "Sangre y Cenizas",
    author: "Jennifer L. Armentrout",
    progress: 65,
    cover: "https://images-na.ssl-images-amazon.com/images/I/91YfntCZRYL.jpg"
  },
  {
    title: "Crimen y Castigo",
    author: "Fiódor Dostoyevski",
    progress: 40,
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UUd4HCgrIVYyXHcLMNicyf8muVAkGW.png"
  },
  {
    title: "De Rodillas",
    author: "Navessa Allen",
    progress: 25,
    cover: "https://m.media-amazon.com/images/I/71jLBXtWJSL._AC_UF1000,1000_QL80_.jpg"
  }
]

export function CurrentlyReading() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Leyendo Actualmente
          </h2>
          <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
            {currentlyReading.length} libros
          </span>
        </div>
        
        <p className="mb-8 text-center text-muted-foreground">
          Porque un solo libro nunca es suficiente...
        </p>

        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {currentlyReading.map((book, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-primary/20 bg-secondary/50 p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex gap-4">
                <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-foreground line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium text-primary">{book.progress}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
