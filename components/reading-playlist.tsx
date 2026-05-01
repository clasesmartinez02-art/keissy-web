"use client"

import { Music, Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const playlist = [
  { title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55" },
  { title: "Sweet Nothing", artist: "Taylor Swift", duration: "3:16" },
  { title: "おなじ朝、おなじ夢", artist: "Toji, mizurei", duration: "3:42" },
  { title: "Luxurious", artist: "Gwen Stefani", duration: "4:24" },
  { title: "Somebody That I Used to Know", artist: "Gotye", duration: "4:04" },
]

export function ReadingPlaylist() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <Music className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Mi Playlist de Lectura
            </h2>
          </div>

          <p className="mb-8 text-center text-muted-foreground">
            La música perfecta para sumergirte en un buen libro
          </p>

          <div className="overflow-hidden rounded-xl border border-primary/20 bg-secondary/30">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/30">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Keissy&apos;s Reading Vibes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {playlist.length} canciones para leer
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-primary/10">
              {playlist.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-primary/5"
                >
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                    <Play className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{song.title}</p>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {song.duration}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/10 p-4">
              <Button
                variant="outline"
                className="w-full gap-2 border-primary/30 hover:bg-primary/10"
              >
                <ExternalLink className="h-4 w-4" />
                Escuchar en Spotify
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
