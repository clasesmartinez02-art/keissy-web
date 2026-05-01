"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface InternalLayoutProps {
  children: React.ReactNode
}

export function InternalLayout({ children }: InternalLayoutProps) {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Contenido con fondo de bruja mística del grimorio */}
      <div 
        className="relative min-h-screen"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bruja3-cnEptpHfaKKHGyQtTSO0O71t9KncsJ.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-background/90" />
        
        {/* Contenido */}
        <div className="relative z-10 pt-24">
          {children}
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
