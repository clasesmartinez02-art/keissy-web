"use client"

import { useState, useEffect } from "react"
import { InternalLayout } from "@/components/internal-layout"
import { Sparkles, Play, Plus, X, Trash2, Search, Loader2, Tv, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface Serie {
  id: string
  title: string
  description: string
  icon: string
  tags: string[]
  image_url?: string
  watch_link?: string
  year?: string
  rating?: string
}

const seriesIniciales: Serie[] = [
  {
    id: "1",
    title: "Supernatural",
    tags: ["Cazadores", "Oscuridad", "Misterio"],
    icon: "ghost",
    description: "Dos hermanos cazan demonios y fantasmas mientras enfrentan su propio destino",
    image_url: "https://image.tmdb.org/t/p/w500/KoYWXbnYuS3b0GyQPkbuexlVK9.jpg",
    year: "2005",
    rating: "8.4"
  },
  {
    id: "2",
    title: "Lucifer",
    tags: ["Demonio", "Crimen", "Romance"],
    icon: "devil",
    description: "El diablo abandona el infierno y abre un club nocturno en Los Angeles",
    image_url: "https://image.tmdb.org/t/p/w500/ekZobS8isE6mA53RAiGDG93hBxL.jpg",
    year: "2016",
    rating: "8.1"
  },
  {
    id: "3",
    title: "Charmed",
    tags: ["Brujas", "Poderes", "Hermanas"],
    icon: "crystal",
    description: "Tres hermanas descubren que son las brujas mas poderosas del mundo",
    image_url: "https://image.tmdb.org/t/p/w500/z4bPJ1BWU2EtV69NII2GrWu1jQs.jpg",
    year: "1998",
    rating: "7.1"
  },
  {
    id: "4",
    title: "Shadowhunters",
    tags: ["Cazadores", "Magia", "Accion"],
    icon: "swords",
    description: "Nefilim protegen al mundo de los demonios usando runas ancestrales",
    image_url: "https://image.tmdb.org/t/p/w500/1P3QtW1IkivqDrKbbwuR0zCYIf9.jpg",
    year: "2016",
    rating: "6.7"
  },
  {
    id: "5",
    title: "Sabrina",
    tags: ["Bruja", "Oscuridad", "Misterio"],
    icon: "witch",
    description: "Una medio bruja navega entre el mundo mortal y el oculto",
    image_url: "https://image.tmdb.org/t/p/w500/yxMpoHO0CXP5o9gB7IfsciilQS4.jpg",
    year: "2018",
    rating: "7.5"
  },
  {
    id: "6",
    title: "The Vampire Diaries",
    tags: ["Vampiros", "Romance", "Drama"],
    icon: "vampire",
    description: "Hermanos vampiros se enamoran de la misma chica en un pueblo misterioso",
    image_url: "https://image.tmdb.org/t/p/w500/kLEha9zVVv8acGFKTX4gjvSR2Q0.jpg",
    year: "2009",
    rating: "8.4"
  },
]

const iconOptions = [
  { value: "ghost", label: "Fantasma", emoji: "👻" },
  { value: "devil", label: "Demonio", emoji: "😈" },
  { value: "crystal", label: "Cristal", emoji: "🔮" },
  { value: "swords", label: "Espadas", emoji: "⚔️" },
  { value: "witch", label: "Bruja", emoji: "🧙‍♀️" },
  { value: "vampire", label: "Vampiro", emoji: "🧛" },
  { value: "crown", label: "Corona", emoji: "👑" },
  { value: "moon", label: "Luna", emoji: "🌙" },
  { value: "fire", label: "Fuego", emoji: "🔥" },
  { value: "skull", label: "Calavera", emoji: "💀" },
]

function getEmoji(icon: string) {
  return iconOptions.find(i => i.value === icon)?.emoji || "✨"
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Serie[]>(seriesIniciales)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedSerie, setSelectedSerie] = useState<any>(null)
  const [newSerie, setNewSerie] = useState({
    title: "",
    description: "",
    icon: "ghost",
    tags: "",
    image_url: "",
    year: "",
    rating: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchSeries()
  }, [])

  // Buscar series automaticamente al escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchSeries(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  async function fetchSeries() {
    const { data } = await supabase
      .from("series")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data && data.length > 0) {
      setSeries(data)
    }
  }

  async function searchSeries(query: string) {
    setIsSearching(true)
    try {
      // Usar TMDB API para buscar series
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=2a94207bfb1f0d0836e65f4d11c0a776&query=${encodeURIComponent(query)}&language=es-ES`
      )
      const data = await response.json()
      
      if (data.results) {
        setSearchResults(data.results.slice(0, 6))
      }
    } catch (error) {
      console.error("Error buscando series:", error)
    }
    setIsSearching(false)
  }

  function selectSearchResult(result: any) {
    setSelectedSerie(result)
    setNewSerie({
      title: result.name || result.original_name,
      description: result.overview || "Sin descripcion disponible",
      icon: detectIcon(result.genre_ids || []),
      tags: "",
      image_url: result.poster_path 
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : "",
      year: result.first_air_date ? result.first_air_date.split("-")[0] : "",
      rating: result.vote_average ? result.vote_average.toFixed(1) : "",
    })
    setSearchResults([])
    setSearchQuery(result.name || result.original_name)
  }

  function detectIcon(genreIds: number[]): string {
    // Mapear generos de TMDB a iconos
    if (genreIds.includes(10765)) return "witch" // Sci-Fi & Fantasy
    if (genreIds.includes(9648)) return "ghost" // Mystery
    if (genreIds.includes(80)) return "devil" // Crime
    if (genreIds.includes(10759)) return "swords" // Action & Adventure
    if (genreIds.includes(18)) return "crystal" // Drama
    if (genreIds.includes(10749)) return "moon" // Romance
    if (genreIds.includes(27)) return "skull" // Horror
    return "ghost"
  }

  function detectTags(genreIds: number[]): string[] {
    const tagMap: Record<number, string> = {
      10765: "Fantasia",
      9648: "Misterio",
      80: "Crimen",
      10759: "Accion",
      18: "Drama",
      10749: "Romance",
      27: "Terror",
      35: "Comedia",
      10768: "Guerra",
    }
    return genreIds.map(id => tagMap[id]).filter(Boolean).slice(0, 3)
  }

  async function handleAddSerie() {
    if (!newSerie.title) return

    const tagsArray = newSerie.tags 
      ? newSerie.tags.split(",").map(t => t.trim()).filter(t => t)
      : selectedSerie 
        ? detectTags(selectedSerie.genre_ids || [])
        : []

    const watchLink = `/series/${newSerie.title.toLowerCase().replace(/\s+/g, "-")}/ver`

    const { data, error } = await supabase
      .from("series")
      .insert({
        title: newSerie.title,
        description: newSerie.description,
        icon: newSerie.icon,
        tags: tagsArray,
        image_url: newSerie.image_url,
        watch_link: watchLink,
        year: newSerie.year,
        rating: newSerie.rating,
      })
      .select()
      .single()

    if (error) {
      alert("Error al agregar serie: " + error.message)
      return
    }

    if (data) {
      setSeries([data, ...series])
      setShowModal(false)
      resetForm()
    }
  }

  function resetForm() {
    setNewSerie({ title: "", description: "", icon: "ghost", tags: "", image_url: "", year: "", rating: "" })
    setSearchQuery("")
    setSearchResults([])
    setSelectedSerie(null)
  }

  async function handleDeleteSerie(id: string) {
    if (!confirm("¿Estás segura de que quieres eliminar esta serie?")) return

    const { error } = await supabase
      .from("series")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error al eliminar la serie: " + error.message)
      return
    }

    setSeries(series.filter(s => s.id !== id))
  }

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Titulo */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="font-serif text-4xl font-bold tracking-wider text-foreground md:text-5xl">
              SERIES DESTACADAS
            </h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Mis series sobrenaturales favoritas que inspiran mis historias
          </p>
        </div>

        {/* Boton Agregar Serie */}
        <div className="mb-8 flex justify-center">
          <Button 
            onClick={() => setShowModal(true)}
            className="gap-2 rounded-full bg-primary px-6 py-3 text-lg font-medium"
          >
            <Plus className="h-5 w-5" />
            Agregar Serie
          </Button>
        </div>

        {/* Grid de series */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((serie) => (
            <div
              key={serie.id}
              className="group relative overflow-hidden rounded-xl border border-primary/30 bg-secondary/50 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              {/* Imagen de la serie */}
              {serie.image_url ? (
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={serie.image_url}
                    alt={serie.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  
                  {/* Rating */}
                  {serie.rating && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-sm font-bold text-primary-foreground">
                      <span>★</span>
                      {serie.rating}
                    </div>
                  )}

                  {/* Boton eliminar */}
                  <button
                    onClick={() => handleDeleteSerie(serie.id)}
                    className="absolute left-3 top-3 rounded-full bg-red-500/80 p-2 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    title="Eliminar serie"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative flex h-40 items-center justify-center bg-primary/10">
                  <span className="text-6xl">{getEmoji(serie.icon)}</span>
                  
                  {/* Boton eliminar */}
                  <button
                    onClick={() => handleDeleteSerie(serie.id)}
                    className="absolute left-3 top-3 rounded-full bg-red-500/80 p-2 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    title="Eliminar serie"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Contenido */}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{getEmoji(serie.icon)}</span>
                  <h3 className="font-serif text-xl font-bold tracking-wide text-foreground">
                    {serie.title}
                  </h3>
                  {serie.year && (
                    <span className="text-sm text-muted-foreground">({serie.year})</span>
                  )}
                </div>

                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {serie.description}
                </p>

                {/* Etiquetas */}
                <div className="mb-4 flex flex-wrap gap-1">
                  {serie.tags?.map((etiqueta, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary"
                    >
                      {etiqueta}
                    </span>
                  ))}
                </div>

                {/* Botones de accion */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => window.open(`https://www.google.com/search?q=ver+${encodeURIComponent(serie.title)}+online`, "_blank")}
                  >
                    <Play className="h-4 w-4" />
                    Ver Online
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 border-primary/30"
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(serie.title)}+serie+informacion`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Info
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Agregar Serie */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/30 bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-foreground">Agregar Nueva Serie</h2>
                <button onClick={() => { setShowModal(false); resetForm() }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Buscador de series */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Buscar serie</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Escribe el nombre de la serie..."
                      className="border-primary/30 bg-secondary pl-10"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
                    )}
                  </div>

                  {/* Resultados de busqueda */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-primary/30 bg-secondary">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => selectSearchResult(result)}
                          className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-primary/10"
                        >
                          {result.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                              alt={result.name}
                              className="h-16 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-12 items-center justify-center rounded bg-primary/20">
                              <Tv className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{result.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {result.first_air_date?.split("-")[0] || "Fecha desconocida"}
                              {result.vote_average && ` • ★ ${result.vote_average.toFixed(1)}`}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview de serie seleccionada */}
                {selectedSerie && newSerie.image_url && (
                  <div className="flex gap-4 rounded-lg border border-primary/30 bg-secondary/50 p-4">
                    <img
                      src={newSerie.image_url}
                      alt={newSerie.title}
                      className="h-32 w-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-foreground">{newSerie.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {newSerie.year} • ★ {newSerie.rating}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {newSerie.description}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Nombre de la serie</label>
                  <Input
                    value={newSerie.title}
                    onChange={(e) => setNewSerie({ ...newSerie, title: e.target.value })}
                    placeholder="The Originals"
                    className="border-primary/30 bg-secondary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Descripcion</label>
                  <textarea
                    value={newSerie.description}
                    onChange={(e) => setNewSerie({ ...newSerie, description: e.target.value })}
                    placeholder="Una breve descripcion de la serie..."
                    className="w-full rounded-lg border border-primary/30 bg-secondary px-3 py-2 text-foreground"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Icono</label>
                  <select
                    value={newSerie.icon}
                    onChange={(e) => setNewSerie({ ...newSerie, icon: e.target.value })}
                    className="w-full rounded-lg border border-primary/30 bg-secondary px-3 py-2 text-foreground"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.emoji} {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Etiquetas (separadas por coma)</label>
                  <Input
                    value={newSerie.tags}
                    onChange={(e) => setNewSerie({ ...newSerie, tags: e.target.value })}
                    placeholder="Vampiros, Romance, Drama"
                    className="border-primary/30 bg-secondary"
                  />
                </div>

                <Button onClick={handleAddSerie} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Serie
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </InternalLayout>
  )
}
