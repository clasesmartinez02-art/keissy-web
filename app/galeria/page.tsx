"use client"

import { useState, useEffect } from "react"
import { InternalLayout } from "@/components/internal-layout"
import { Sparkles, Plus, X, Trash2, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface GalleryImage {
  id: string
  title: string
  image_url: string
}

interface Comment {
  id: string
  image_id: string
  author_name: string
  content: string
  created_at: string
}

const imagenesIniciales = [
  {
    id: "1",
    title: "Castillo Oscuro",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop"
  },
  {
    id: "2",
    title: "Bruja del Bosque",
    image_url: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    title: "Luna Llena",
    image_url: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    title: "Ritual Antiguo",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
  },
  {
    id: "5",
    title: "Bosque Encantado",
    image_url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=300&fit=crop"
  },
  {
    id: "6",
    title: "Pocion Magica",
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop"
  },
]

export default function GaleriaPage() {
  const [imagenes, setImagenes] = useState<GalleryImage[]>(imagenesIniciales)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newImage, setNewImage] = useState({ title: "", image_url: "" })
  const [newComment, setNewComment] = useState({ author_name: "", content: "" })
  const supabase = createClient()

  useEffect(() => {
    fetchImagenes()
  }, [])

  async function fetchImagenes() {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data && data.length > 0) {
      setImagenes(data)
    }
  }

  async function fetchComments(imageId: string) {
    const { data } = await supabase
      .from("gallery_comments")
      .select("*")
      .eq("image_id", imageId)
      .order("created_at", { ascending: true })
    
    if (data) {
      setComments(data)
    }
  }

  async function handleAddImage() {
    if (!newImage.image_url) return

    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        title: newImage.title || "Sin titulo",
        image_url: newImage.image_url,
      })
      .select()
      .single()

    if (data) {
      setImagenes([data, ...imagenes])
      setShowAddModal(false)
      setNewImage({ title: "", image_url: "" })
    }
  }

  async function handleDeleteImage(id: string) {
    if (!confirm("¿Estás segura de que quieres eliminar esta imagen?")) return

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error al eliminar la imagen: " + error.message)
      return
    }

    setImagenes(imagenes.filter(img => img.id !== id))
  }

  async function handleAddComment() {
    if (!newComment.content || !showCommentsModal) return

    const { data, error } = await supabase
      .from("gallery_comments")
      .insert({
        image_id: showCommentsModal,
        author_name: newComment.author_name || "Anonimo",
        content: newComment.content,
      })
      .select()
      .single()

    if (data) {
      setComments([...comments, data])
      setNewComment({ author_name: "", content: "" })
    }
  }

  function openComments(imageId: string) {
    setShowCommentsModal(imageId)
    fetchComments(imageId)
  }

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Titulo */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="font-serif text-4xl font-bold tracking-wider text-foreground md:text-5xl">
              GALERIA MISTICA
            </h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Imagenes que capturan la esencia de mis mundos sobrenaturales
          </p>
        </div>

        {/* Boton Subir Imagen */}
        <div className="mb-8 flex justify-center">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="gap-2 rounded-full bg-primary px-6 py-3 text-lg font-medium"
          >
            <Plus className="h-5 w-5" />
            Subir Nueva Imagen
          </Button>
        </div>

        {/* Grid de imagenes */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {imagenes.map((imagen) => (
            <div
              key={imagen.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-primary/30 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <img
                src={imagen.image_url}
                alt={imagen.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              {/* Titulo */}
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-medium text-foreground">{imagen.title}</p>
              </div>

              {/* Botones de accion */}
              <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openComments(imagen.id)}
                  className="rounded-full bg-primary/80 p-2 text-primary-foreground transition-colors hover:bg-primary"
                  title="Ver comentarios"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteImage(imagen.id)}
                  className="rounded-full bg-red-500/80 p-2 text-white transition-colors hover:bg-red-500"
                  title="Eliminar imagen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Agregar Imagen */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-primary/30 bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-foreground">Subir Nueva Imagen</h2>
                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Titulo</label>
                  <Input
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    placeholder="Nombre de la imagen"
                    className="border-primary/30 bg-secondary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">URL de la imagen</label>
                  <Input
                    value={newImage.image_url}
                    onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="border-primary/30 bg-secondary"
                  />
                </div>

                <Button onClick={handleAddImage} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Subir Imagen
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Comentarios */}
        {showCommentsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-primary/30 bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-foreground">Comentarios</h2>
                <button onClick={() => setShowCommentsModal(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Lista de comentarios */}
              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">No hay comentarios aun. Se el primero en comentar!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-sm font-medium text-primary">{comment.author_name}</p>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Formulario nuevo comentario */}
              <div className="space-y-3 border-t border-primary/20 pt-4">
                <Input
                  value={newComment.author_name}
                  onChange={(e) => setNewComment({ ...newComment, author_name: e.target.value })}
                  placeholder="Tu nombre (opcional)"
                  className="border-primary/30 bg-secondary"
                />
                <div className="flex gap-2">
                  <Input
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    placeholder="Escribe un comentario..."
                    className="border-primary/30 bg-secondary"
                  />
                  <Button onClick={handleAddComment} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InternalLayout>
  )
}
