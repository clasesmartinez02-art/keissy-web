"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Book {
  id: string
  title: string
  category: string
  cover_url: string
}

export function BooksPreview() {
  const [books, setBooks] = useState<Book[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchBooks() {
      const { data } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4)

      if (data) {
        setBooks(data)
      }
    }
    fetchBooks()
  }, [])

  if (books.length === 0) return null

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="sparkle mb-8 text-center font-serif text-2xl font-bold tracking-wider text-foreground">
          Ultimos Libros Agregados
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {books.map((book) => (
            <Link href="/libros" key={book.id}>
              <div className="group relative overflow-hidden rounded-xl border border-border/50 transition-all hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={book.cover_url || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=400&fit=crop"}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="mb-1 inline-block rounded-full bg-primary/80 px-2 py-0.5 text-xs text-primary-foreground">
                      {book.category}
                    </span>
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{book.title}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
