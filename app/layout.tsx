import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: '--font-cinzel',
  display: 'swap'
})

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'Keissy Nicole | Historias que despiertan tu magia',
    template: '%s | Keissy Nicole',
  },
  description: 'Escritora de historias sobrenaturales. Brujas, vampiros, demonios y mundos donde la magia y la oscuridad se entrelazan con el amor y el destino. Psicologa y lectora voraz.',
  keywords: ['brujas', 'vampiros', 'fantasia', 'libros', 'novelas', 'romance', 'sobrenatural', 'magia', 'escritora', 'Keissy Nicole'],
  authors: [{ name: 'Keissy Nicole' }],
  creator: 'Keissy Nicole',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Keissy Nicole',
    title: 'Keissy Nicole | Historias que despiertan tu magia',
    description: 'Escritora de historias sobrenaturales. Brujas, vampiros, demonios y mundos donde la magia y la oscuridad se entrelazan.',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bruja1.png-Ucuukp9QeXmRRbQpTZbtTK6K48GKdZ.jpeg',
        width: 1200,
        height: 630,
        alt: 'Keissy Nicole - Escritora de historias sobrenaturales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keissy Nicole | Historias que despiertan tu magia',
    description: 'Escritora de historias sobrenaturales. Brujas, vampiros, demonios y mundos magicos.',
    images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bruja1.png-Ucuukp9QeXmRRbQpTZbtTK6K48GKdZ.jpeg'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <body className={`${cinzel.variable} ${cormorant.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
