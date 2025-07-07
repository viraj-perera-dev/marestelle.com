import { getMessages } from '@/lib/getMessages';
import { generateSEOMetadata } from '@/components/Metadata';
import Image from 'next/image';
import Section1 from '@/components/sections/Section1';
import Section2 from '@/components/sections/Section2';
import Section3 from '@/components/sections/Section3'; 
import Section4 from '@/components/sections/Section4';
import Section5 from '@/components/sections/Section5';
import ContractSection from '@/components/sections/ContactSection';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'mare e stelle',
    description: 'Scopri la storia della nostra famiglia tra le onde delle Isole Tremiti.',
    keywords: ['Isole Tremiti', 'Motonave Victor', 'escursioni mare', 'pesce fresco'],
    siteColor: 'light',
    url: '',
    siteName: 'mare e stelle',
    image: '',
    imageAlt: '',
  }
});



export default async function Home({ params }) {
  const messages = await getMessages(params.locale);
  const t = (key) => messages.HomePage?.[key] ?? key;

  if (!messages) return;

  return (
    <>
      <main>
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#fefefe] z-50 bg-black">
          <Image className="mask-radial-[95%_95%] mask-radial-from-0% mask-radial-circle w-full h-full object-cover" width={500} height={500} src="/assets/sectionImages/DJI_0956.jpg" alt="barca" />
          <h1 className="absolute top-36 md:top-auto md:bottom-20 p-5 md:left-10 text-white md:text-6xl text-[2.5rem] leading-[3rem] md:leading-[4rem] font-bold w-full max-w-xl">{t('title')}</h1>
          <p className="absolute bottom-5 md:bottom-auto p-5 md:top-36 md:right-10 text-white md:text-2xl text-xl w-full max-w-xl">{t('subtitle')}</p>
        </div>
      </main>
      <Section1 params={params} />
      <Section2 params={params} />
      <Section3 />
      <Section4 params={params}/>
      <Section5 params={params}/>
      <ContractSection params={params}/>
    </>
  );
}
