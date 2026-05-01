import { NextRequest, NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "2f4e503a7b0a46f7a7a0b1c2d3e4f5a6"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "all"

  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 })
  }

  const results: any[] = []

  // Buscar libros en Open Library
  if (type === "all" || type === "books") {
    try {
      const openLibRes = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=15`,
        { next: { revalidate: 3600 } }
      )
      const openLibData = await openLibRes.json()
      
      if (openLibData.docs) {
        results.push(
          ...openLibData.docs.slice(0, 15).map((doc: any) => ({
            id: `openlib-${doc.key}`,
            external_id: doc.key,
            title: doc.title,
            type: "book",
            image_url: doc.cover_i 
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
              : null,
            description: doc.first_sentence?.[0] || null,
            author: doc.author_name?.[0] || "Autor desconocido",
            year: doc.first_publish_year?.toString(),
            source: "openlib",
            subjects: doc.subject?.slice(0, 3) || []
          }))
        )
      }
    } catch (error) {
      console.error("Error Open Library:", error)
    }
  }

  // Buscar series en TMDB
  if (type === "all" || type === "series") {
    try {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`,
        { next: { revalidate: 3600 } }
      )
      const tmdbData = await tmdbRes.json()
      
      if (tmdbData.results) {
        results.push(
          ...tmdbData.results.slice(0, 15).map((show: any) => ({
            id: `tmdb-${show.id}`,
            external_id: show.id.toString(),
            title: show.name,
            type: "series",
            image_url: show.poster_path 
              ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
              : null,
            description: show.overview || null,
            year: show.first_air_date?.split("-")[0],
            rating: show.vote_average?.toFixed(1),
            source: "tmdb",
            popularity: show.popularity
          }))
        )
      }
    } catch (error) {
      console.error("Error TMDB:", error)
    }
  }

  // Buscar peliculas en TMDB
  if (type === "all" || type === "movies") {
    try {
      const tmdbMoviesRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`,
        { next: { revalidate: 3600 } }
      )
      const tmdbMoviesData = await tmdbMoviesRes.json()
      
      if (tmdbMoviesData.results) {
        results.push(
          ...tmdbMoviesData.results.slice(0, 10).map((movie: any) => ({
            id: `tmdb-movie-${movie.id}`,
            external_id: movie.id.toString(),
            title: movie.title,
            type: "movie",
            image_url: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : null,
            description: movie.overview || null,
            year: movie.release_date?.split("-")[0],
            rating: movie.vote_average?.toFixed(1),
            source: "tmdb",
            popularity: movie.popularity
          }))
        )
      }
    } catch (error) {
      console.error("Error TMDB Movies:", error)
    }
  }

  return NextResponse.json({ results, total: results.length })
}
