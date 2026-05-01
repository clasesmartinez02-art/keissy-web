"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Moon, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bruja3-cnEptpHfaKKHGyQtTSO0O71t9KncsJ.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-md p-8 shadow-2xl shadow-primary/20">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/20">
              <Moon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-foreground">
              Bienvenida de vuelta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entra a tu mundo magico
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Correo electronico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="border-primary/30 bg-background/50 focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Contrasena
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrasena secreta"
                  className="border-primary/30 bg-background/50 pr-10 focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 rounded-full bg-primary py-6 font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar al mundo magico"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              No tienes cuenta?{" "}
              <Link href="/auth/registro" className="font-medium text-primary hover:underline">
                Unete al aquelarre
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
