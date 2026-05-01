"use client"

import { useState, useEffect } from "react"
import { InternalLayout } from "@/components/internal-layout"
import { BookOpen, ArrowLeft, ChevronLeft, ChevronRight, Home } from "lucide-react"
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

// Contenido de ejemplo para los libros
const contenidoEjemplo = [
  {
    capitulo: "Prologo",
    contenido: `La noche era oscura y la luna brillaba con un resplandor sobrenatural sobre el antiguo castillo. Las sombras danzaban entre los arboles del bosque, susurrando secretos que solo los iniciados podian escuchar.

En lo profundo de la biblioteca, una joven de ojos violeta leia un grimorio antiguo, sus dedos trazando las runas con reverencia. No sabia que esa noche cambiaria su destino para siempre.

"El poder no se hereda," habia escrito la antigua bruja en las paginas amarillentas. "Se conquista."

Y ella estaba lista para conquistarlo.`
  },
  {
    capitulo: "Capitulo 1: El Despertar",
    contenido: `El viento aullaba contra las ventanas del castillo cuando Helena desperto de su sueno. Las velas se habian apagado, dejando solo la luz de la luna para iluminar la habitacion.

Algo habia cambiado. Lo sentia en sus huesos, en la forma en que la magia pulsaba bajo su piel como una segunda sangre.

Se levanto de la cama y camino hacia el espejo antiguo que colgaba de la pared. Su reflejo le devolvio la mirada, pero habia algo diferente en sus ojos. Un brillo que no estaba alli antes.

"Finalmente," susurro una voz detras de ella. "Has despertado."

Helena se giro rapidamente, pero no habia nadie en la habitacion. Solo las sombras que parecian moverse con vida propia.`
  },
  {
    capitulo: "Capitulo 2: La Hermandad",
    contenido: `Los dias siguientes fueron un torbellino de descubrimientos. Helena aprendio que pertenecia a un linaje antiguo de brujas, guardianas de secretos que el mundo mortal habia olvidado hace mucho tiempo.

La Hermandad de las Sombras la habia estado observando desde su nacimiento, esperando el momento en que sus poderes despertaran.

"Tienes un don unico," le explico la anciana Morgana, lider de la Hermandad. "Puedes caminar entre los mundos, ver lo que otros no pueden ver."

Helena miro sus manos, sintiendo la energia que fluia a traves de ellas. Era aterrador y emocionante al mismo tiempo.

"Pero con este don viene una responsabilidad," continuo Morgana. "Y enemigos que haran cualquier cosa por obtener tu poder."`
  }
]

export default function LeerLibroPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [libro, setLibro] = useState<Libro | null>(null)
  const [paginaActual, setPaginaActual] = useState(0)
  const [fontSize, setFontSize] = useState(18)
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

  const contenido = contenidoEjemplo[paginaActual] || contenidoEjemplo[0]

  return (
    <InternalLayout>
      <div className="min-h-screen">
        {/* Header del lector */}
        <div className="sticky top-0 z-10 border-b border-primary/20 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Link href="/libros">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
              </Link>
              <div className="hidden items-center gap-2 md:flex">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-serif text-lg font-medium">
                  {libro?.title || "Cargando..."}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tamaño:</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              >
                A-
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              >
                A+
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido del libro */}
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            {/* Portada si es el prologo */}
            {paginaActual === 0 && libro?.cover_url && (
              <div className="mb-8 flex justify-center">
                <img
                  src={libro.cover_url}
                  alt={libro.title}
                  className="h-64 w-auto rounded-lg shadow-lg shadow-primary/20"
                />
              </div>
            )}

            {/* Titulo del capitulo */}
            <h1 className="mb-8 text-center font-serif text-3xl font-bold text-primary">
              {contenido.capitulo}
            </h1>

            {/* Texto del capitulo */}
            <div 
              className="prose prose-invert mx-auto max-w-none"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              {contenido.contenido.split('\n\n').map((parrafo, index) => (
                <p key={index} className="mb-6 text-foreground/90">
                  {parrafo}
                </p>
              ))}
            </div>

            {/* Navegacion de paginas */}
            <div className="mt-12 flex items-center justify-between border-t border-primary/20 pt-8">
              <Button
                variant="outline"
                onClick={() => setPaginaActual(Math.max(0, paginaActual - 1))}
                disabled={paginaActual === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <span className="text-sm text-muted-foreground">
                Pagina {paginaActual + 1} de {contenidoEjemplo.length}
              </span>

              <Button
                variant="outline"
                onClick={() => setPaginaActual(Math.min(contenidoEjemplo.length - 1, paginaActual + 1))}
                disabled={paginaActual === contenidoEjemplo.length - 1}
                className="gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Info del libro */}
            <div className="mt-8 rounded-xl border border-primary/20 bg-secondary/30 p-6">
              <div className="flex items-start gap-4">
                {libro?.cover_url && (
                  <img
                    src={libro.cover_url}
                    alt={libro.title}
                    className="h-24 w-auto rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {libro?.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {libro?.description}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                    {libro?.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InternalLayout>
  )
}
