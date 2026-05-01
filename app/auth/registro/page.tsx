"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Sparkles, Loader2 } from "lucide-react"

export default function RegistroPage() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${window.location.origin}/auth/callback`,
        data: {
          nombre: nombre,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
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
          <div className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-md p-8 shadow-2xl shadow-primary/20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
              Bienvenida al aquelarre
            </h1>
            <p className="text-muted-foreground mb-6">
              Hemos enviado un correo magico a <span className="text-primary font-medium">{email}</span>. 
              Confirma tu correo para activar tu cuenta y unirte a nuestro mundo.
            </p>
            <Link href="/auth/login">
              <Button className="rounded-full bg-primary px-8 py-6 font-semibold">
                Ir a iniciar sesion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-foreground">
              Unete al aquelarre
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Crea tu cuenta y descubre la magia
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Nombre magico
              </label>
              <Input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre en el aquelarre"
                className="border-primary/30 bg-background/50 focus:border-primary"
                required
              />
            </div>

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
                Contrasena secreta
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 6 caracteres"
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

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Confirmar contrasena
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contrasena"
                className="border-primary/30 bg-background/50 focus:border-primary"
                required
              />
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
                  Creando tu magia...
                </>
              ) : (
                "Unirme al aquelarre"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Entra aqui
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
