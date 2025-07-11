"use client";

import Link from "next/link";
import Image from "next/image";

export default function DetailPageClient({ data, locale, itinerary }) {
  return (
    <div className="w-full h-auto bg-white">
      <main className="max-w-2xl mx-auto px-4 py-12 pt-36 h-auto">
        <Link
          href={`/${locale}/itinerary/${itinerary.id}#stop-${data.id}`}
          className="text-blue-600 mb-4 inline-block cursor-pointer hover:underline"
        >
          ← Torna all'itinerario
        </Link>

        <h1 className="text-4xl font-bold mb-6">{data.title}</h1>
        
        {data.image && (
          <Image
            loading="lazy"
            src={`/assets/diario/${data.image}`}
            alt={data.title}
            width={800}
            height={400}
            className="rounded-lg mb-6 max-h-[400px] w-full object-cover"
          />
        )}
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-800 whitespace-pre-wrap">
            {data.description}
          </p>
        </div>
        
        <div className="mt-8 flex gap-4">
          <Link
            href={`/${locale}/diario-di-bordo#stop-${data.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            ← Torna all'itinerario
          </Link>
          
          <Link
            href={`/${locale}/contatti`}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition"
          >
            Prenota esperienza
          </Link>
        </div>
      </main>
    </div>
  );
}