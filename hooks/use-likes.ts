"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useLikes(itemType: "book" | "series" | "gallery", itemId: string) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      // Contar likes
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("item_type", itemType)
        .eq("item_id", itemId)

      setLikesCount(count || 0)

      // Verificar si el usuario dio like
      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("item_type", itemType)
          .eq("item_id", itemId)
          .eq("user_id", user.id)
          .single()

        setLiked(!!data)
      }
    }
    init()
  }, [itemType, itemId])

  async function toggleLike() {
    if (!userId) return

    setLoading(true)
    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("item_type", itemType)
        .eq("item_id", itemId)
        .eq("user_id", userId)

      setLiked(false)
      setLikesCount((prev) => prev - 1)
    } else {
      await supabase.from("likes").insert({
        item_type: itemType,
        item_id: itemId,
        user_id: userId,
      })

      setLiked(true)
      setLikesCount((prev) => prev + 1)
    }
    setLoading(false)
  }

  return { liked, likesCount, toggleLike, loading, isLoggedIn: !!userId }
}

export function useFavorites(itemType: "book" | "series" | "gallery", itemId: string) {
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)

        const { data } = await supabase
          .from("favorites")
          .select("id")
          .eq("item_type", itemType)
          .eq("item_id", itemId)
          .eq("user_id", user.id)
          .single()

        setFavorited(!!data)
      }
    }
    init()
  }, [itemType, itemId])

  async function toggleFavorite() {
    if (!userId) return

    setLoading(true)
    if (favorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("item_type", itemType)
        .eq("item_id", itemId)
        .eq("user_id", userId)

      setFavorited(false)
    } else {
      await supabase.from("favorites").insert({
        item_type: itemType,
        item_id: itemId,
        user_id: userId,
      })

      setFavorited(true)
    }
    setLoading(false)
  }

  return { favorited, toggleFavorite, loading, isLoggedIn: !!userId }
}
