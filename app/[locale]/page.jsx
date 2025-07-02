import { getMessages } from '@/lib/getMessages';
import { generateSEOMetadata } from '@/components/Metadata';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import Section1 from '@/components/sections/Section1';
import Section2 from '@/components/sections/Section2';
import Section3 from '@/components/sections/Section3'; 
import Section4 from '@/components/sections/Section4';
import Section5 from '@/components/sections/Section5';
import ContractSection from '@/components/sections/ContactSection';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'title test 1',
    description: 'description test 1',
    keywords: ['test'],
    siteColor: 'dark',
    url: '',
    siteName: '',
    image: '',
    imageAlt: '',
  }
});



export default async function Home({ params }) {
  const messages = await getMessages(params.locale);
  const t = (key) => messages.HomePage?.[key] ?? key;

  return (
    <>
      <main>
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#fefefe] z-50 bg-black">
          <Image className="mask-radial-[95%_95%] mask-radial-from-0% mask-radial-circle w-full h-full" width={500} height={500} src="/assets/sectionImages/IMG_1356.jpeg" alt="barca" />
          <h1 className="absolute md:bottom-[15rem] p-5 md:left-[15rem] text-white text-6xl font-bold w-full max-w-xl">{t('title')}</h1>
          <p className="absolute bottom-[13rem] p-5 md:top-[10rem] md:right-[5rem] text-white text-2xl w-full max-w-xl">{t('subtitle')}</p>
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
