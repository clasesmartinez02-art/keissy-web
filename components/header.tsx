"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Search, Moon, Sun, ChevronDown, Home, BookOpen, Tv, Image, Crown, User, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
  }

  const navItems = [
    { name: "Inicio", icon: Home, href: "/" },
    { name: "Libros", icon: BookOpen, href: "/libros" },
    { name: "Series", icon: Tv, href: "/series" },
    { name: "Galeria", icon: Image, href: "/galeria" },
    { name: "Historia", icon: Crown, href: "/historia" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/50">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bruja1.png-Ucuukp9QeXmRRbQpTZbtTK6K48GKdZ.jpeg"
              alt="Keissy Nicole Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wider text-foreground">KEISSY NICOLE</span>
            <span className="text-xs text-muted-foreground">Historias que despiertan tu magia</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && (theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />)}
          </Button>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 rounded-full border-border/50 bg-secondary pl-10 text-sm"
            />
          </form>

          {/* Login/User dropdown */}
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-secondary" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-primary/50 bg-primary/10 px-4 text-foreground hover:bg-primary/20"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {user.user_metadata?.nombre?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.user_metadata?.nombre || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-primary/50 bg-primary/10 px-4 text-foreground hover:bg-primary/20"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">Iniciar Sesion</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/registro">Registrarse</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border/50 bg-background p-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            {!user && (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Iniciar Sesion
                </Link>
                <Link
                  href="/auth/registro"
                  className="flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
