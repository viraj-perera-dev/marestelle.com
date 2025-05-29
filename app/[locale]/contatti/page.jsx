import { getMessages } from '@/lib/getMessages';
import { generateSEOMetadata } from '@/components/Metadata';
import { Link } from '@/i18n/navigation';

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



export default async function Contact({ params }) {
  
  const messages = await getMessages(params.locale);
  const t = (key) => messages.Contact?.[key] ?? key;

  return (
    <main>
      <div className="w-full h-screen flex flex-col justify-center items-center bg-[#fefefe] z-50">
        <p className="text-red-500 text-6xl font-bold">{t('title')}</p>
      </div>
    </main>
  );
}
