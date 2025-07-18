import { getMessages } from '@/lib/getMessages'; 
import { generateSEOMetadata } from '@/components/Metadata';
import Image from 'next/image';
import { MdArrowOutward } from 'react-icons/md';
import Link from 'next/link';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Chi Siamo - Motonave Victor',
    description: 'Scopri la storia della nostra famiglia tra le onde delle Isole Tremiti.',
    keywords: ['Isole Tremiti', 'Motonave Victor', 'escursioni mare', 'pesce fresco'],
    siteColor: 'light',
    url: '',
    siteName: 'Victor Tremiti',
    image: '',
    imageAlt: '',
  }
});

export default async function ChiSiamo({ params }) {
  const messages = await getMessages(params.locale);
  const t = (key) => messages.AboutUs?.[key] ?? key;

  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-svh flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/sectionImages/DJI_0959_hero.jpg')" }}>
        <div className="bg-black/50 absolute inset-0" />
        <div className="absolute bottom-20 md:left-10 left-2 z-10 text-start text-white px-4">
          <h1 className="text-4xl md:text-7xl font-bold">La Nostra Storia</h1>
          <p className="mt-4 text-xl md:text-2xl max-w-2xl">Un viaggio tra tradizione, mare e passione di famiglia.</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Radici nel mare delle Tremiti</h2>
            <p className="mb-4">Riccardo è cresciuto alle Isole Tremiti dove ha imparato da suo padre Roberto tutti i segreti del mare, a bordo della storica <strong>Motonave Victor</strong>.</p>
            <p className="mb-4">Facciamo questo lavoro da 20 anni, con l’impegno di valorizzare i sapori più genuini di queste isole, servendovi ciò che il mare ci regala, come espressione del passato marinaresco che ci caratterizza.</p>
          </div>
          <div className="w-full h-[30rem]">
            <Image priority src="/assets/sectionImages/DSC02686.jpg" alt="Motonave Victor" width={500} height={500} className="rounded-xl shadow-lg w-full h-full object-cover" />
          </div>
        </div>

        <div className="mt-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="w-full h-[30rem]">
            <Image loading="lazy" src="/assets/food/piatto.jpg" alt="Roberto cucina pesce fresco" width={500} height={500} className="rounded-xl shadow-lg w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Tradizione in cucina</h2>
            <p className="mb-4">Roberto gestisce la <strong>Motonave Victor</strong>, organizzando gite full-day con un pranzo completo a base di pesce fresco pescato da lui stesso, ripetendo le ricette tramandate dalla madre Alba.</p>
            <p className="mb-4">L’obiettivo è semplice: offrire piatti di pesce dai sapori genuini, utilizzando anche materie prime coltivate direttamente da lui.</p>
          </div>
        </div>

        <div className="mt-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Una nuova generazione</h2>
            <p className="mb-4">Suo figlio Riccardo organizza escursioni brevi attorno all’arcipelago Tremitese a bordo di un tradizionale <strong>gozzo in legno</strong>, affiancato da sua madre Paola.</p>
            <p className="mb-4">Un modo intimo e autentico per vivere il mare, accompagnati da chi lo conosce da sempre.</p>
          </div>
          <div className="w-full h-[30rem]">
            <Image loading="lazy" src="/assets/sectionImages/DJI_0987.jpg" alt="Riccardo con il gozzo" width={500} height={500} className="rounded-xl shadow-lg w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Vivi il Mare con Noi</h2>
        <p className="text-lg mb-8">Prenota la tua esperienza autentica alle Isole Tremiti con la nostra famiglia.</p>
        <Link href="/contatti" className="flex items-center justify-center gap-2 w-fit px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition mx-auto">
          Contattaci <MdArrowOutward size={20} />
        </Link>
      </section>
    </main>
  );
}
