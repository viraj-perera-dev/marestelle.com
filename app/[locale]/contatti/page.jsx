import { getMessages } from "@/lib/getMessages";
import { generateSEOMetadata } from "@/components/Metadata";
import ContactForm from "@/components/sections/ContactSection";
import { MdArrowOutward } from "react-icons/md";

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: "Prenota Ora - Esperienze in Barca alle Tremiti",
    description:
      "Prenota la tua escursione in barca o un tour completo alle Isole Tremiti con la Motonave Victor.",
    keywords: [
      "prenota",
      "escursioni tremiti",
      "gite in barca",
      "motonave Victor",
    ],
    siteColor: "light",
    url: "",
    siteName: "Victor Tremiti",
    image: "",
    imageAlt: "",
  },
});

export default async function Contact({ params }) {
  const messages = await getMessages(params.locale);
  const t = (key) => messages.Contact?.[key] ?? key;

  return (
    <main className="bg-white text-gray-800">
      {/* Hero */}
      <section
        className="relative h-svh flex items-center justify-center bg-cover bg-center md:bg-[center_35%] w-full"
        style={{ backgroundImage: "url('/assets/sectionImages/hero_ragazza.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="z-10 absolute bottom-20 md:left-10 left-2 text-start text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Booking Info + Contact Form */}
      <section className="bg-gray-50">
        <div className="grid md:grid-cols-2 grid-cols-1">
          {/* Info Side */}
          <div className="w-full md:w-2/3 mx-auto flex flex-col justify-center py-20 md:py-0 px-5">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 uppercase">
              {t('sectionTitle')}
            </h2>
            <p className="mb-4 text-lg md:text-xl font-semibold text-neutral-600">
              {t('sectionDescription')}
            </p>
            <ul className="list-disc list-inside mb-6">
              <li className="text-md md:text-lg font-semibold text-black">
                {t('sectionList')[0]}
              </li>
              <li className="text-md md:text-lg font-semibold text-black">
                {t('sectionList')[1]}
              </li>
              <li className="text-md md:text-lg font-semibold text-black">
                {t('sectionList')[2]}
              </li>
            </ul>
            <p className="text-gray-600 text-md md:text-xl mb-10">
              {t('sectionContact')}{" "}
              <a
                href="tel:+39123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold"
              >
                +39 123456789
              </a>
            </p>
            <a
              href="tel:+39123456789"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex items-center justify-center gap-2 font-semibold text-md md:text-xl border border-blue-500 text-blue-500 w-full py-3 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer">
                {t('sectionButtonLabel')} <MdArrowOutward size={20} />
              </button>
            </a>
          </div>

          {/* Contact Form */}
          <div className="w-full">
          <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
