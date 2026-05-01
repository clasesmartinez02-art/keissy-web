"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Calendar, Sparkles } from "lucide-react"

type UpcomingBook = {
  id: string
  title: string
  description?: string
  cover_url?: string
  release_date?: string
  category: string
}

export function UpcomingBooks() {
  const [books, setBooks] = useState<UpcomingBook[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function loadBooks() {
      const { data } = await supabase
        .from("upcoming_books")
        .select("*")
        .order("release_date", { ascending: true })
        .limit(3)

      if (data) setBooks(data)
    }
    loadBooks()
  }, [])

  if (books.length === 0) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-center font-serif text-2xl font-bold tracking-wide text-foreground">
            PROXIMAMENTE
          </h2>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-1"
            >
              <div className="rounded-lg bg-card/80 p-4">
                <div className="flex gap-4">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="h-32 w-24 rounded-lg object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-32 w-24 items-center justify-center rounded-lg bg-primary/20">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="mb-1 inline-flex items-center gap-1 text-xs text-primary">
                      <Calendar className="h-3 w-3" />
                      {book.release_date
                        ? new Date(book.release_date).toLocaleDateString("es", {
                            month: "long",
                            year: "numeric",
                          })
                        : "Pronto"}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      {book.title}
                    </h3>
                    {book.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {book.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Efecto de brillo */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
