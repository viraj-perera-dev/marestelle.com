import { getMessages } from '@/lib/getMessages'; 
import { generateSEOMetadata } from '@/components/Metadata';
import Image from 'next/image';
import { MdArrowOutward } from 'react-icons/md';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Chi Siamo - Mare e Stelle',
    description: 'Scopri la storia della nostra famiglia tra le onde delle Isole Tremiti.',
    keywords: ['Isole Tremiti', 'Mare e Stelle', 'escursioni mare', 'tour Isole Tremiti', 'tour mare', 'tour Isole Tremiti'],
    siteColor: 'light',
    url: 'https://marestelle.com/it/chi-siamo',
    siteName: 'Mare e Stelle',
    image: '/assets/sectionImages/DJI_0956.jpeg',
    imageAlt: 'escursioni alle Isole Tremiti',
  }
});

export default async function ChiSiamo({ params }) {
  const messages = await getMessages(params.locale);
  const tSection = (key) => messages.AboutUs?.[key] ?? key;

  

  return (
    <>
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-svh flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/sectionImages/DJI_0959_hero.webp')" }}>
        <div className="bg-black/50 absolute inset-0" />
        <div className="absolute bottom-20 md:left-10 left-2 z-10 text-start text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold">{tSection('title')}</h1>
          <p className="mt-4 text-xl md:text-2xl max-w-2xl">{tSection('subtitle')}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">{tSection('sections')[0]?.title}</h2>
            <p className="mb-4">{tSection('sections')[0]?.description}</p>
          </div>
          <div className="w-full h-[30rem]">
            <Image priority src={tSection('sections')[0]?.image} alt={tSection('sections')[0]?.title} width={500} height={500} className="rounded-xl shadow-lg w-full h-full object-cover" />
          </div>
        </div>

        <div className="mt-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="w-full h-[30rem]">
            <Image loading="lazy" src={tSection('sections')[1]?.image} alt={tSection('sections')[1]?.title} width={500} height={500} className="rounded-xl shadow-lg w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{tSection('sections')[1]?.title}</h2>
            <p className="mb-4">{tSection('sections')[1]?.description}</p>
          </div>
        </div>

        <div className="mt-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">{tSection('sections')[2]?.title}</h2>
            <p className="mb-4">{tSection('sections')[2]?.description}</p>
          </div>
          <div className="w-full h-[30rem]">
            <Image loading="lazy" src={tSection('sections')[2]?.image} alt={tSection('sections')[2]?.title} width={500} height={500} className="rounded-xl shadow-lg w-full h-full object-cover" />
          </div>
        </div>

        <div className="mt-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="w-full h-[30rem]">
            <Image loading="lazy" src={tSection('sections')[3]?.image} alt={tSection('sections')[3]?.title} width={500} height={500} className="rounded-xl shadow-lg w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{tSection('sections')[3]?.title}</h2>
            <p className="mb-4">{tSection('sections')[3]?.description}</p>
          </div>
        </div>

        <div className="mt-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">{tSection('sections')[4]?.title}</h3>
            <p className="mb-4">{tSection('sections')[4]?.description}</p>
            <p className="text-2xl font-bold mb-4">{tSection('sections')[4]?.listLabel}</p>
            <ul className="list-disc list-inside">
              {tSection('sections')[4]?.list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="mt-5">{tSection('sections')[4]?.description2}</p>
          </div>
          <div className="w-full h-[30rem]">
            <Image loading="lazy" src={tSection('sections')[4]?.image} alt={tSection('sections')[4]?.title} width={500} height={500} className="rounded-xl shadow-lg w-full h-full object-cover" />
          </div>
        </div>

      </section>

      {/* CTA */}
      <section className="bg-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">{tSection('bannerTitle')}</h2>
        <p className="text-lg mb-8">{tSection('bannerDescription')}</p>
        <Link href="/contatti" className="flex items-center justify-center gap-2 w-fit px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition mx-auto">
          {tSection('buttonLabel')} <MdArrowOutward size={20} />
        </Link>
      </section>
    </main>
    <Footer locale={params.locale} />
    </>
  );
}
