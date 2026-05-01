"use client"

import { Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLikes, useFavorites } from "@/hooks/use-likes"
import { cn } from "@/lib/utils"

type Props = {
  itemType: "book" | "series" | "gallery"
  itemId: string
  showCount?: boolean
  size?: "sm" | "md"
}

export function LikeButton({ itemType, itemId, showCount = true, size = "md" }: Props) {
  const { liked, likesCount, toggleLike, loading, isLoggedIn } = useLikes(itemType, itemId)

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "sm" : "default"}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isLoggedIn) toggleLike()
      }}
      disabled={loading || !isLoggedIn}
      className={cn(
        "gap-1.5",
        liked && "text-red-500 hover:text-red-600"
      )}
      title={isLoggedIn ? (liked ? "Quitar me gusta" : "Me gusta") : "Inicia sesion para dar like"}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      {showCount && <span className="text-sm">{likesCount}</span>}
    </Button>
  )
}

export function FavoriteButton({ itemType, itemId, size = "md" }: Props) {
  const { favorited, toggleFavorite, loading, isLoggedIn } = useFavorites(itemType, itemId)

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "sm" : "default"}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isLoggedIn) toggleFavorite()
      }}
      disabled={loading || !isLoggedIn}
      className={cn(
        favorited && "text-primary"
      )}
      title={isLoggedIn ? (favorited ? "Quitar de favoritos" : "Agregar a favoritos") : "Inicia sesion para guardar"}
    >
      <Bookmark className={cn("h-4 w-4", favorited && "fill-current")} />
    </Button>
  )
}
