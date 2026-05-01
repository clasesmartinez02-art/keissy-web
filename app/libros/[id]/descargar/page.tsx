"use client"

import { useState, useEffect } from "react"
import { InternalLayout } from "@/components/internal-layout"
import { Download, ArrowLeft, FileText, Smartphone, BookOpen, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { use } from "react"

interface Libro {
  id: string
  title: string
  description: string
  category: string
  cover_url: string
}

const formatosDisponibles = [
  {
    id: "pdf",
    nombre: "PDF",
    descripcion: "Ideal para leer en computadora",
    icon: FileText,
    tamano: "2.4 MB"
  },
  {
    id: "epub",
    nombre: "EPUB",
    descripcion: "Compatible con Kindle y e-readers",
    icon: BookOpen,
    tamano: "1.8 MB"
  },
  {
    id: "mobi",
    nombre: "MOBI",
    descripcion: "Formato nativo de Kindle",
    icon: Smartphone,
    tamano: "1.9 MB"
  }
]

export default function DescargarLibroPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [libro, setLibro] = useState<Libro | null>(null)
  const [formatoSeleccionado, setFormatoSeleccionado] = useState<string | null>(null)
  const [descargando, setDescargando] = useState(false)
  const [descargaCompleta, setDescargaCompleta] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchLibro()
  }, [resolvedParams.id])

  async function fetchLibro() {
    const { data } = await supabase
      .from("books")
      .select("*")
      .eq("id", resolvedParams.id)
      .single()
    
    if (data) {
      setLibro(data)
    }
  }

  function handleDescargar() {
    if (!formatoSeleccionado) return
    
    setDescargando(true)
    
    // Simular descarga
    setTimeout(() => {
      setDescargando(false)
      setDescargaCompleta(true)
      
      // Crear un archivo de texto como ejemplo
      const contenido = `
${libro?.title || "Libro"}
Por Keissy Nicole

=====================================

PROLOGO

La noche era oscura y la luna brillaba con un resplandor 
sobrenatural sobre el antiguo castillo. Las sombras danzaban 
entre los arboles del bosque, susurrando secretos que solo 
los iniciados podian escuchar.

=====================================

Gracias por descargar este libro.
Visita keissynicole.com para mas historias magicas.
      `
      
      const blob = new Blob([contenido], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${libro?.title || "libro"}.${formatoSeleccionado}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 2000)
  }

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/libros">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Libros
            </Button>
          </Link>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Info del libro */}
            <div className="text-center md:text-left">
              {libro?.cover_url && (
                <div className="mb-6 flex justify-center md:justify-start">
                  <img
                    src={libro.cover_url}
                    alt={libro.title}
                    className="h-80 w-auto rounded-xl shadow-2xl shadow-primary/30"
                  />
                </div>
              )}
              <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">
                {libro?.title || "Cargando..."}
              </h1>
              <p className="mb-4 text-lg text-primary">Por Keissy Nicole</p>
              <p className="text-muted-foreground">{libro?.description}</p>
              <span className="mt-4 inline-block rounded-full bg-primary/20 px-4 py-2 text-sm text-primary">
                {libro?.category}
              </span>
            </div>

            {/* Opciones de descarga */}
            <div className="rounded-2xl border border-primary/20 bg-secondary/30 p-6">
              <div className="mb-6 flex items-center gap-3">
                <Download className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Descargar Libro
                </h2>
              </div>

              {!descargaCompleta ? (
                <>
                  <p className="mb-6 text-muted-foreground">
                    Selecciona el formato que prefieras para descargar tu copia del libro.
                  </p>

                  {/* Formatos */}
                  <div className="mb-6 space-y-3">
                    {formatosDisponibles.map((formato) => (
                      <button
                        key={formato.id}
                        onClick={() => setFormatoSeleccionado(formato.id)}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                          formatoSeleccionado === formato.id
                            ? "border-primary bg-primary/10"
                            : "border-primary/20 hover:border-primary/50"
                        }`}
                      >
                        <div className={`rounded-lg p-2 ${
                          formatoSeleccionado === formato.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-primary"
                        }`}>
                          <formato.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{formato.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{formato.descripcion}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{formato.tamano}</span>
                      </button>
                    ))}
                  </div>

                  {/* Boton de descarga */}
                  <Button
                    onClick={handleDescargar}
                    disabled={!formatoSeleccionado || descargando}
                    className="w-full gap-2 py-6 text-lg"
                  >
                    {descargando ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        Descargar Gratis
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-500/20 p-4">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-bold text-foreground">
                    Descarga Completada
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Tu libro ha sido descargado exitosamente. Disfruta la lectura!
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link href={`/libros/${resolvedParams.id}/leer`}>
                      <Button variant="outline" className="w-full gap-2">
                        <BookOpen className="h-4 w-4" />
                        Leer Online
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDescargaCompleta(false)
                        setFormatoSeleccionado(null)
                      }}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Descargar otro formato
                    </Button>
                  </div>
                </div>
              )}

              {/* Info adicional */}
              <div className="mt-6 rounded-lg bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Contenido exclusivo</h4>
                    <p className="text-sm text-muted-foreground">
                      Al descargar obtendras acceso a capitulos bonus y contenido extra de la autora.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InternalLayout>
  )
}
