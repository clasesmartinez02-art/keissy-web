"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/header";
import { InternalLayout } from "@/components/internal-layout";
import { Footer } from "@/components/footer";

type ResultItem = {
  id: string | number;
  titulo: string;
};

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ cliente estable (NO se recrea)
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setErrorMsg("");
        return;
      }

      setLoading(true);
      setErrorMsg("");

      try {
        const { data, error } = await supabase
          .from("libros") // 🔥 CAMBIA ESTO si tu tabla tiene otro nombre
          .select("id, titulo")
          .ilike("titulo", `%${query}%`);

        if (error) {
          console.error("Supabase error:", error);
          setErrorMsg("Error buscando datos");
          setResults([]);
        } else {
          setResults(data ?? []);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        setErrorMsg("Error inesperado");
        setResults([]);
      }

      setLoading(false);
    };

    fetchResults();
  }, [query, supabase]);

  return (
    <>
      <Header />

      <InternalLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            {query ? `Resultados para: "${query}"` : "Buscar contenido"}
          </h1>

          {!query && (
            <p className="text-gray-500">
              Escribe algo en el buscador...
            </p>
          )}

          {loading && <p>Cargando...</p>}

          {errorMsg && (
            <p className="text-red-500">{errorMsg}</p>
          )}

          {!loading && !errorMsg && query && results.length === 0 && (
            <p>No se encontraron resultados.</p>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 rounded shadow hover:shadow-lg transition"
                >
                  {item.titulo}
                </div>
              ))}
            </div>
          )}
        </div>
      </InternalLayout>

      <Footer />
    </>
  );
}