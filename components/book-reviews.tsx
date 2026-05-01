"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Star, Send, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

type Review = {
  id: string
  user_name: string
  rating: number
  content: string
  created_at: string
}

type Props = {
  bookId: string
}

export function BookReviews({ bookId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadReviews()
    checkUser()
  }, [bookId])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function loadReviews() {
    setLoading(true)
    const { data } = await supabase
      .from("book_reviews")
      .select("*")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false })

    if (data) setReviews(data)
    setLoading(false)
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !content.trim()) return

    setSubmitting(true)
    const userName = user.user_metadata?.nombre || user.email?.split("@")[0] || "Usuario"

    await supabase.from("book_reviews").insert({
      book_id: bookId,
      user_id: user.id,
      user_name: userName,
      rating,
      content: content.trim(),
    })

    setContent("")
    setRating(5)
    loadReviews()
    setSubmitting(false)
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-serif text-xl font-bold">Resenas</h3>
        {averageRating && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold">{averageRating}</span>
            <span className="text-sm text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Formulario de resena */}
      {user ? (
        <form onSubmit={submitReview} className="mb-6 rounded-lg border border-border/50 bg-background/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm">Tu calificacion:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu resena..."
            className="mb-3 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
            rows={3}
          />
          <Button type="submit" disabled={submitting || !content.trim()} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publicar resena
          </Button>
        </form>
      ) : (
        <div className="mb-6 rounded-lg border border-border/50 bg-background/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <a href="/auth/login" className="text-primary hover:underline">Inicia sesion</a> para dejar una resena
          </p>
        </div>
      )}

      {/* Lista de resenas */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border/50 pb-4 last:border-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{review.user_name}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.content}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString("es", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Aun no hay resenas. Se el primero en opinar.
        </p>
      )}
    </div>
  )
}
