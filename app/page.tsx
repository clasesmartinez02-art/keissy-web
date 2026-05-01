"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/header";
import { InternalLayout } from "@/components/internal-layout";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("tu_tabla")
        .select("*")
        .ilike("titulo", `%${query}%`);

      if (!error && data) {
        setResults(data);
      } else {
        setResults([]);
      }

      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <>
      <Header />
      <InternalLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            Resultados para: "{query}"
          </h1>

          {loading ? (
            <p>Cargando...</p>
          ) : results.length === 0 ? (
            <p>No se encontraron resultados.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((item: any) => (
                <div key={item.id} className="border p-4 rounded">
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
