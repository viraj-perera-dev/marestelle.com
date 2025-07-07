"use client";

import { supabase } from "@/utils/supabaseClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function FullDescriptionPage({ params }) {
  const { id } = params;
  const locale = useLocale();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      const { data, error } = await supabase
        .from("itinerary")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error);
      } else {
        setData(data);
      }
    };

    fetchItinerary();
  }, [id]);

  if (error) return notFound();
  if (!data)
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="p-10">Caricamento...</p>
      </div>
    );

  return (
    <div className="w-full h-auto bg-white">
      <main className="max-w-2xl mx-auto px-4 py-12 pt-36 h-auto">
        <Link
          href={`/${locale}/diario-di-bordo#stop-${id}`}
          className="text-blue-600 mb-4 inline-block cursor-pointer"
        >
          ← Torna all'itinerario
        </Link>

        <h1 className="text-4xl font-bold mb-6">{data.title}</h1>
        <img
          src={`/assets/diario/${data.image}`}
          alt={data.title}
          className="rounded-lg mb-6 max-h-[400px] w-full object-cover"
        />
        <p className="text-lg text-gray-800 whitespace-pre-wrap">
          {data.description}
        </p>
        <Link
          href={`/${locale}/diario-di-bordo#stop-${id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-full mt-4 inline-block cursor-pointer"
        >
          ← Torna all'itinerario
        </Link>
      </main>
    </div>
  );
}
