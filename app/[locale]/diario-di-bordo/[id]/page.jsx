"use client";

import { supabase } from "@/utils/supabaseClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";

export default async function FullDescriptionPage({ params }) {
  const { id } = params;
  const locale = useLocale();
  

  const { data, error } = await supabase
    .from("itinerary")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 mt-20 h-auto">
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
  );
}
