"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { InternalLayout } from "@/components/internal-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Heart, Bookmark, Book, Tv, Image, Save, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

type FavoriteItem = {
  id: string
  item_type: string
  item_id: string
  title?: string
  image_url?: string
}

export default function PerfilPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [activeTab, setActiveTab] = useState<"perfil" | "favoritos">("perfil")
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      setDisplayName(user.user_metadata?.nombre || "")

      // Cargar perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setDisplayName(profile.display_name || user.user_metadata?.nombre || "")
        setBio(profile.bio || "")
      }

      // Cargar favoritos con detalles
      const { data: favs } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)

      if (favs) {
        const enrichedFavs = await Promise.all(
          favs.map(async (fav) => {
            let title = ""
            let image_url = ""

            if (fav.item_type === "book") {
              const { data } = await supabase
                .from("books")
                .select("title, cover_url")
                .eq("id", fav.item_id)
                .single()
              title = data?.title || ""
              image_url = data?.cover_url || ""
            } else if (fav.item_type === "series") {
              const { data } = await supabase
                .from("series")
                .select("title, image_url")
                .eq("id", fav.item_id)
                .single()
              title = data?.title || ""
              image_url = data?.image_url || ""
            } else if (fav.item_type === "gallery") {
              const { data } = await supabase
                .from("gallery_images")
                .select("title, image_url")
                .eq("id", fav.item_id)
                .single()
              title = data?.title || ""
              image_url = data?.image_url || ""
            }

            return { ...fav, title, image_url }
          })
        )
        setFavorites(enrichedFavs)
      }

      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function saveProfile() {
    if (!user) return

    setSaving(true)
    await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName,
      bio,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "book": return <Book className="h-4 w-4" />
      case "series": return <Tv className="h-4 w-4" />
      case "gallery": return <Image className="h-4 w-4" />
      default: return null
    }
  }

  if (loading) {
    return (
      <InternalLayout>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </InternalLayout>
    )
  }

  return (
    <InternalLayout>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header del perfil */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              {displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold">{displayName || "Usuario"}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab("perfil")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                activeTab === "perfil"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              Mi Perfil
            </button>
            <button
              onClick={() => setActiveTab("favoritos")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                activeTab === "favoritos"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className="h-4 w-4" />
              Mis Favoritos ({favorites.length})
            </button>
          </div>

          {activeTab === "perfil" ? (
            <div className="space-y-6 rounded-xl border border-border/50 bg-card/50 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Nombre</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuentanos sobre ti..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                  rows={4}
                />
              </div>
              <Button onClick={saveProfile} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar cambios
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.length === 0 ? (
                <div className="rounded-xl border border-border/50 bg-card/50 p-8 text-center">
                  <Bookmark className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Aun no tienes favoritos</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Explora libros, series y la galeria para agregar a tus favoritos
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="flex gap-3 rounded-xl border border-border/50 bg-card/50 p-4"
                    >
                      {fav.image_url && (
                        <img
                          src={fav.image_url}
                          alt={fav.title}
                          className="h-16 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="mb-1 flex items-center gap-2 text-xs text-primary">
                          {getIcon(fav.item_type)}
                          <span className="uppercase">
                            {fav.item_type === "book" ? "Libro" : fav.item_type === "series" ? "Serie" : "Galeria"}
                          </span>
                        </div>
                        <p className="font-medium">{fav.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </InternalLayout>
  )
}
