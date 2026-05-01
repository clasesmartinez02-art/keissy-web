"use client"

import { useState, useEffect, useCallback } from "react"
import { InternalLayout } from "@/components/internal-layout"
import { CategoryButtons } from "@/components/category-buttons"
import { Book, Sparkles, Plus, X, BookOpen, Download, Loader2, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Libro {
  id: string
  title: string
  description: string
  category: string
  cover_url: string
  read_link: string
  buy_link: string
}

const librosIniciales = [
  {
    id: "1",
    title: "La Bruja de las Sombras",
    category: "Brujas",
    description: "Una historia de magia oscura y redencion",
    cover_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=400&fit=crop",
    read_link: "/libros/1/leer",
    buy_link: "/libros/1/descargar"
  },
  {
    id: "2",
    title: "El Eco del Destino",
    category: "Fantasia",
    description: "Cuando el destino te llama, no puedes escapar",
    cover_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    read_link: "/libros/2/leer",
    buy_link: "/libros/2/descargar"
  },
  {
    id: "3",
    title: "Ecos de un Corazon Roto",
    category: "Romance",
    description: "El amor trasciende la oscuridad",
    cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    read_link: "/libros/3/leer",
    buy_link: "/libros/3/descargar"
  },
]

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>(librosIniciales)
  const [showModal, setShowModal] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{title: string, cover: string, author: string}[]>([])
  const [newBook, setNewBook] = useState({
    title: "",
    description: "",
    category: "Brujas",
    cover_url: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchLibros()
  }, [])

  async function fetchLibros() {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data && data.length > 0) {
      setLibros(data)
    }
  }

  // Buscar portada automaticamente usando Open Library API
  const searchBookCover = useCallback(async (title: string) => {
    if (title.length < 3) {
      setSearchResults([])
      return
    }
    
    setIsSearching(true)
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=5`
      )
      const data = await response.json()
      
      if (data.docs && data.docs.length > 0) {
        const results = data.docs
          .filter((doc: any) => doc.cover_i)
          .slice(0, 5)
          .map((doc: any) => ({
            title: doc.title,
            author: doc.author_name?.[0] || "Autor desconocido",
            cover: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          }))
        setSearchResults(results)
        
        // Auto-seleccionar la primera portada encontrada
        if (results.length > 0 && !newBook.cover_url) {
          setNewBook(prev => ({ ...prev, cover_url: results[0].cover }))
        }
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error buscando portada:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [newBook.cover_url])

  // Debounce para buscar mientras escribe
  useEffect(() => {
    const timer = setTimeout(() => {
      if (newBook.title) {
        searchBookCover(newBook.title)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [newBook.title, searchBookCover])

  async function handleAddBook() {
    if (!newBook.title) return

    const { data, error } = await supabase
      .from("books")
      .insert({
        title: newBook.title,
        description: newBook.description || "",
        category: newBook.category,
        cover_url: newBook.cover_url || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=400&fit=crop",
        read_link: "",
        buy_link: "",
      })
      .select()
      .single()

    if (error) {
      alert("Error al subir el libro: " + error.message)
      return
    }

    if (data) {
      // Actualizar con los links usando el ID generado
      const { data: updatedBook } = await supabase
        .from("books")
        .update({
          read_link: `/libros/${data.id}/leer`,
          buy_link: `/libros/${data.id}/descargar`,
        })
        .eq("id", data.id)
        .select()
        .single()

      if (updatedBook) {
        setLibros([updatedBook, ...libros])
      } else {
        setLibros([{ ...data, read_link: `/libros/${data.id}/leer`, buy_link: `/libros/${data.id}/descargar` }, ...libros])
      }
      setShowModal(false)
      setNewBook({ title: "", description: "", category: "Brujas", cover_url: "" })
      setSearchResults([])
    }
  }

  function selectCover(coverUrl: string) {
    setNewBook(prev => ({ ...prev, cover_url: coverUrl }))
  }

  async function handleDeleteBook(id: string) {
    if (!confirm("¿Estás segura de que quieres eliminar este libro?")) return

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error al eliminar el libro: " + error.message)
      return
    }

    setLibros(libros.filter(libro => libro.id !== id))
  }

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Titulo de la pagina */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="font-serif text-4xl font-bold tracking-wider text-foreground md:text-5xl">
              MIS LIBROS
            </h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explora mi coleccion de historias sobrenaturales donde la magia, el romance y la oscuridad se entrelazan
          </p>
        </div>

        {/* Boton Subir Libro */}
        <div className="mb-8 flex justify-center">
          <Button 
            onClick={() => setShowModal(true)}
            className="gap-2 rounded-full bg-primary px-6 py-3 text-lg font-medium"
          >
            <Plus className="h-5 w-5" />
            Subir Libro
          </Button>
        </div>

        {/* Filtros de categoria */}
        <CategoryButtons />

        {/* Grid de libros */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {libros.map((libro) => (
            <div
              key={libro.id}
              className="group relative overflow-hidden rounded-xl border border-primary/20 bg-secondary/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
            >
              {/* Imagen del libro */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={libro.cover_url}
                  alt={libro.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                
                {/* Categoria */}
                <span className="absolute right-3 top-3 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground">
                  {libro.category}
                </span>

                {/* Boton eliminar */}
                <button
                  onClick={() => handleDeleteBook(libro.id)}
                  className="absolute left-3 top-3 rounded-full bg-red-500/80 p-2 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                  title="Eliminar libro"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Info del libro */}
              <div className="p-5">
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                  {libro.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {libro.description}
                </p>
                
                {/* Links generados automaticamente */}
                <div className="flex flex-col gap-2">
                  <Link 
                    href={libro.read_link || `/libros/${libro.id}/leer`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <BookOpen className="h-4 w-4" />
                    Leer Online
                  </Link>
                  <Link 
                    href={libro.buy_link || `/libros/${libro.id}/descargar`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    <Download className="h-4 w-4" />
                    Descargar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal para subir libro */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/30 bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-foreground">Subir Nuevo Libro</h2>
                <button onClick={() => {
                  setShowModal(false)
                  setSearchResults([])
                  setNewBook({ title: "", description: "", category: "Brujas", cover_url: "" })
                }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Titulo del libro
                    {isSearching && <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-primary" />}
                  </label>
                  <div className="relative">
                    <Input
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      placeholder="Escribe el nombre del libro..."
                      className="border-primary/30 bg-secondary pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    La portada se buscara automaticamente
                  </p>
                </div>

                {/* Resultados de busqueda de portadas */}
                {searchResults.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Portadas encontradas - Haz clic para seleccionar
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => selectCover(result.cover)}
                          className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                            newBook.cover_url === result.cover 
                              ? "border-primary shadow-lg shadow-primary/30" 
                              : "border-transparent hover:border-primary/50"
                          }`}
                        >
                          <img
                            src={result.cover}
                            alt={result.title}
                            className="h-32 w-24 object-cover"
                          />
                          {newBook.cover_url === result.cover && (
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                              <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                                Seleccionada
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview de portada seleccionada */}
                {newBook.cover_url && (
                  <div className="flex justify-center">
                    <div className="overflow-hidden rounded-lg border border-primary/30">
                      <img
                        src={newBook.cover_url}
                        alt="Portada seleccionada"
                        className="h-48 w-36 object-cover"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Descripcion</label>
                  <Input
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    placeholder="Una historia de magia y misterio..."
                    className="border-primary/30 bg-secondary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Categoria</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full rounded-lg border border-primary/30 bg-secondary px-3 py-2 text-foreground"
                  >
                    <option value="Brujas">Brujas</option>
                    <option value="Vampiros">Vampiros</option>
                    <option value="Demonios">Demonios</option>
                    <option value="Fantasia">Fantasia</option>
                    <option value="Romance">Romance</option>
                  </select>
                </div>

                <div className="rounded-lg bg-primary/10 p-4">
                  <h4 className="mb-2 font-medium text-foreground">Se generaran automaticamente:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Link para leer online
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-primary" />
                      Link para descargar
                    </li>
                  </ul>
                </div>

                <Button onClick={handleAddBook} className="w-full gap-2" disabled={!newBook.title}>
                  <Plus className="h-4 w-4" />
                  Subir Libro
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </InternalLayout>
  )
}
