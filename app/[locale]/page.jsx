// app/[locale]/page.jsx
import { getMessages } from '@/lib/getMessages';
import { generateSEOMetadata } from '@/components/Metadata';
import Image from 'next/image';
import Section1 from '@/components/sections/Section1';
import Section2 from '@/components/sections/Section2';
import Section3 from '@/components/sections/Section3'; 
import Section4 from '@/components/sections/Section4';
import Section5 from '@/components/sections/Section5';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }) {
  return generateSEOMetadata({
    contentMetadata: {
      title: 'Mare e Stelle - Isole Tremiti',
      description: 'Scopri la storia della nostra famiglia tra le onde delle Isole Tremiti.',
      keywords: ['Isole Tremiti', 'Motonave Victor', 'escursioni mare', 'pesce fresco'],
      siteColor: 'light',
      url: 'https://marestelle.com/it',
      siteName: 'Mare e Stelle',
      image: '/assets/sectionImages/DJI_0956.jpeg',
      imageAlt: 'escursioni alle Isole Tremiti',
    }
  });
}

export default async function Home({ params }) {
  const { locale } = params;
  
  try {
    const messages = await getMessages(locale);
    
    if (!messages) {
      return (
        <div className="h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    }

    const t = (key) => messages.HomePage?.[key] ?? key;

    if(!messages) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-colors duration-300">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      );
    }

    return (
      <>
        <main>
          <div className="w-full h-screen flex flex-col justify-center items-center bg-[#fefefe] z-50 bg-black">
            <Image 
              className="mask-radial-[95%_95%] mask-radial-from-0% mask-radial-circle w-full h-full object-cover" 
              width={1920} 
              height={1080} 
              src="/assets/sectionImages/DJI_0956.webp" 
              alt="barca"
              priority
            />
            <h1 className="absolute top-36 md:top-auto md:bottom-20 p-5 md:left-10 text-white md:text-5xl text-4xl leading-[2.5rem] md:leading-[3.5rem] font-bold w-full max-w-xl">
              {t('title')}
            </h1>
            <p className="absolute bottom-5 md:bottom-auto p-5 md:top-36 md:right-10 text-white md:text-2xl text-xl w-full max-w-xl">
              {t('subtitle')}
            </p>
          </div>
        </main>
        
        <Section1 params={params} />
        <Section2 params={params} />
        <Section3 params={params} />
        <Section4 params={params} />
        <Section5 params={params} />
        <ContactSection params={params} />
        <Footer locale={params.locale} />
      </>
    );
  } catch (error) {
    console.error('Error loading page:', error);
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Error loading page. Please try again.</p>
      </div>
    );
  }
}