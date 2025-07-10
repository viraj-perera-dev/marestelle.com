import { generateSEOMetadata } from '@/components/Metadata';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Diario di Bordo - Itinerario Isole Tremiti',
    description: 'Segui il nostro viaggio interattivo attraverso le Isole Tremiti',
    keywords: ['Isole Tremiti', 'itinerario', 'mappa interattiva', 'diario di bordo'],
    siteColor: 'light',
    url: '',
    siteName: 'Victor Tremiti',
    image: '',
    imageAlt: '',
  }
});

const itineraries = [
  {
    id: 1,
    title: 'Itinerario Completo',
    subtitle: 'Condizioni Meteomarine Ideali',
    image: '/assets/diario/cretaccio.jpg',
    description:
      'Quando il mare è calmo, è possibile fare il giro completo dell’arcipelago. Ideale per esplorare ogni angolo nascosto delle isole.',
  },
  {
    id: 2,
    title: 'Venti da Sud-Est (Scirocco, Ostro, Levante)',
    subtitle: 'Rotta Settentrionale',
    image: '/assets/diario/scheme2.jpg',
    description:
      'Soste a nord: Cala dei Turchi, Cala del Cretaccio, Cala Tonda. Il versante nord è più protetto e tranquillo.',
  },
  {
    id: 3,
    title: 'Venti da Nord o Ponente (Tramontana, Maestrale)',
    subtitle: 'Rotta Meridionale',
    image: '/assets/diario/scheme3.jpg',
    description:
      'Soste relax nel sud dell’arcipelago: Cala dei Pesci, Cala Matano, Cala del Sale.',
  },
  {
    id: 4,
    title: 'Vento da Libeccio (SW)',
    subtitle: 'Rotta Breve e Relax',
    image: '/assets/diario/scheme4.jpg',
    description:
      'Itinerario più corto con soste prolungate: Cala dei Turchi, Pagliai, Cretaccio. Poche cale al riparo.',
  },
];

export default function DiarioDiBordoPage({ params }) {
  return (
    <main className="bg-white text-gray-800">
      <section className="w-full h-[70vh] bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: `url('/assets/sectionImages/IMG_1356.jpeg')` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Diario di Bordo</h1>
          <p className="mt-4 text-xl md:text-2xl text-white max-w-2xl mx-auto">
            Come cambiano gli itinerari in base al vento? Scopri i percorsi che seguiamo per garantire sicurezza e meraviglia.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <p className="text-center text-neutral-700 max-w-3xl mx-auto mb-12 text-lg">
          Spesso i clienti mi chiedono come cambia il giro delle isole in base ai venti.
          A seconda delle condizioni meteomarine, l’itinerario previsto può subire variazioni. La sicurezza dei passeggeri viene sempre prima. 
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          {itineraries.map((item) => (
            <div key={item.id} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white border">
              <div className="relative h-56 md:h-72 w-full">
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
                  href={`/${params.locale}/itinerary`}
                  className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Visualizza Itinerario
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
