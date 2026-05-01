import { InternalLayout } from "@/components/internal-layout"
import { Moon, Sparkles, Eye, Wind } from "lucide-react"

export default function HistoriaPage() {
  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Titulo */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Moon className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-4xl font-bold tracking-wider text-foreground md:text-5xl">
              La Historia de Keissy Nicole
            </h1>
          </div>
        </div>

        {/* Historia principal */}
        <div className="mx-auto max-w-4xl">
          {/* Imagen central */}
          <div className="relative mb-12 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-primary/50 shadow-2xl shadow-primary/30">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cZlcZaDaJ8gnvCst1acCXUbH771m9R.png"
                  alt="Keissy Nicole"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg">
                La Elegida
              </div>
            </div>
          </div>

          {/* Texto de la historia */}
          <div className="space-y-8 text-center">
            {/* Parrafo 1 */}
            <div className="rounded-2xl border border-primary/20 bg-secondary/30 p-8 backdrop-blur-sm">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Keissy Nicole no siempre perteneció al mundo de las sombras.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Antes, era como cualquier otra persona... <span className="text-primary">curiosa</span>, 
                <span className="text-primary"> silenciosa</span>, con una extraña conexión con lo desconocido. 
                Desde pequeña sentía que algo la observaba en la oscuridad, pero no con maldad... 
                sino como si la estuviera <span className="italic">esperando</span>.
              </p>
            </div>

            {/* Parrafo 2 */}
            <div className="flex items-center justify-center gap-4">
              <Eye className="h-6 w-6 text-primary/50" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <Sparkles className="h-6 w-6 text-primary" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
              <Eye className="h-6 w-6 text-primary/50" />
            </div>

            <div className="rounded-2xl border border-primary/20 bg-secondary/30 p-8 backdrop-blur-sm">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Nunca entendió por qué los espejos a veces reflejaban más de lo que debía, 
                o por qué escuchaba <span className="text-primary">susurros</span> cuando todo estaba en silencio. 
                Pensó que era su imaginación... <span className="italic">hasta que dejó de serlo</span>.
              </p>
            </div>

            {/* Momento del cambio */}
            <div className="py-8">
              <h2 className="mb-4 font-serif text-3xl font-bold text-primary">
                Todo cambió una noche.
              </h2>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 backdrop-blur-sm">
              <Wind className="mx-auto mb-4 h-8 w-8 text-primary" />
              <p className="text-lg leading-relaxed text-muted-foreground">
                Una noche sin luna, donde el viento susurraba nombres que nadie más podía escuchar. 
                Keissy siguió una voz... <span className="text-primary">suave</span>, 
                <span className="text-primary"> hipnótica</span>... imposible de ignorar.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Sin saber cómo, llegó a un lugar que no existía en ningún mapa... 
                un cruce entre mundos, donde la realidad se doblaba y el tiempo parecía no avanzar.
              </p>
            </div>

            {/* Revelacion */}
            <div className="flex items-center justify-center gap-4">
              <Moon className="h-6 w-6 text-primary/50" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <Moon className="h-8 w-8 text-primary" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
              <Moon className="h-6 w-6 text-primary/50" />
            </div>

            <div className="rounded-2xl border-2 border-primary/40 bg-primary/10 p-10 backdrop-blur-sm">
              <h3 className="mb-6 font-serif text-2xl font-bold text-foreground">
                Ahí lo entendió todo.
              </h3>
              <p className="text-xl leading-relaxed text-primary">
                No era una coincidencia.
              </p>
              <p className="mt-2 text-xl font-semibold leading-relaxed text-primary">
                Nunca lo fue.
              </p>
              <div className="mt-8 text-center">
                <p className="font-serif text-3xl font-bold tracking-wider text-foreground">
                  Keissy había sido elegida.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <Sparkles className="h-6 w-6 text-primary" />
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="mt-16 text-center">
            <p className="mb-6 text-muted-foreground">Sigue mi historia en redes</p>
            <div className="flex justify-center gap-4">
              {["Instagram", "TikTok", "Goodreads"].map((red) => (
                <a
                  key={red}
                  href="#"
                  className="rounded-full border border-primary/30 bg-secondary/50 px-6 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  {red}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </InternalLayout>
  )
}
