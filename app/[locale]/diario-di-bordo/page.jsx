import { generateSEOMetadata } from '@/components/Metadata';
import Link from 'next/link';
import Image from 'next/image';
import { MdArrowOutward } from 'react-icons/md';
import { getMessages } from '@/lib/getMessages'; 

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Diario di Bordo - Itinerario Isole Tremiti',
    description: 'Segui il nostro viaggio interattivo attraverso le Isole Tremiti',
    keywords: ['Isole Tremiti', 'itinerario', 'mappa interattiva', 'diario di bordo'],
    siteColor: 'light',
    url: 'https://marestelle.com/it/diario-di-bordo',
    siteName: 'Mare e Stelle',
    image: '/assets/sectionImages/itinerario.jpeg',
    imageAlt: 'diario di bordo mare e stelle',
  }
});


export default async function DiarioDiBordoPage({ params }) {

  const messages = await getMessages(params.locale);
  const tSection = (key) => messages.DiarioDiBordo?.[key] ?? key;

  const rawItineraries = tSection("itineraries");
  const itineraries = Array.isArray(rawItineraries) ? rawItineraries : [];
  
  return (
    <main className="bg-white text-gray-800">
      <section className="w-full h-[70vh] bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: `url('/assets/sectionImages/IMG_1356.webp')` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{tSection("title")}</h1>
          <p className="mt-4 text-xl md:text-2xl text-white max-w-2xl mx-auto">
            {tSection("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <p className="text-center text-neutral-700 max-w-3xl mx-auto mb-12 text-lg">
          {tSection("description")}
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          {itineraries.map((item) => (
            <div key={item.id} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-blue-50">
              <div className="relative h-56 md:h-[28rem]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{item.subtitle}</p>
                <p className="text-neutral-600 mt-4 text-sm md:text-base">{item.description}</p>
                <Link
                  href={`/${params.locale}/itinerary/${item.id}`}
                  className="mt-6 border border-blue-600 text-blue-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 hover:text-white transition ease-in-out duration-300 flex items-center gap-2 w-fit"
                >
                  Visualizza Itinerario
                  <MdArrowOutward size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
