export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <p className="sparkle text-center text-lg font-medium text-muted-foreground">
            La magia no está fuera, está en todo lo que imaginas
          </p>
          <div className="flex items-center gap-2 text-primary">
            <span>✦</span>
            <span>◇</span>
            <span>✦</span>
          </div>
          <p className="text-center text-sm text-muted-foreground/70">
            © 2026 Keissy Nicole. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
