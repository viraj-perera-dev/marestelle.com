import { getMessages } from "@/lib/getMessages";
import FAQList from "@/components/FAQList"; // Client component
import { generateSEOMetadata } from "@/components/Metadata";
import Footer from "@/components/Footer";

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: "FAQ - Marestelle",
    description: "Scopri le nostre domande più frequenti.",
    keywords: ['Isole Tremiti', 'Mare e Stelle', 'escursioni mare', 'tour Isole Tremiti', 'tour mare', 'domande frequenti', 'domande'],
    siteColor: 'light',
    url: 'https://marestelle.com/it/faq',
    siteName: 'Mare e Stelle',
    image: '/assets/sectionImages/DJI_0956.jpeg',
    imageAlt: 'faq mare e stelle',
  },
});

export default async function FAQ({ params }) {
  const messages = await getMessages(params.locale);
  const t = (key) => messages.FAQ?.[key] ?? key;
  const questions = messages.FAQ?.questions ?? [];

  return (
    <>
    <main className="bg-neutral-100 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative h-svh flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/sectionImages/DJI_0959_hero.webp')",
        }}
      >
        <div className="bg-black/50 absolute inset-0" />
        <div className="absolute bottom-20 md:left-10 left-2 z-10 text-start text-white px-4">
          <h1 className="text-4xl md:text-7xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-xl md:text-2xl max-w-2xl">{t("subtitle")}</p>
        </div>
      </section>
      <div className="mt-8 w-11/12 md:w-1/2 mx-auto pt-20 pb-36">
        <FAQList questions={questions} searchBar={true}/>
      </div>
    </main>
    <Footer locale={params.locale} />
    </>
  );
}
