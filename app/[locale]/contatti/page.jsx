import { getMessages } from "@/lib/getMessages";
import { generateSEOMetadata } from "@/components/Metadata";
import ContactForm from "@/components/sections/ContactSection";
import { MdArrowOutward } from "react-icons/md";
import Footer from "@/components/Footer";
import Link from "next/link";
import FAQList from "@/components/FAQList"; // Client component

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
  const questions = messages.Contact?.questions ?? [];

  return (
    <>
      <main className="bg-white text-gray-800">
        {/* Hero */}
        <section
          className="relative h-svh flex items-center justify-center bg-cover bg-center md:bg-[center_35%] w-full"
          style={{
            backgroundImage: "url('/assets/sectionImages/hero_ragazza.webp')",
          }}
        >
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="z-10 absolute bottom-20 md:left-10 left-2 text-start text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold">{t("title")}</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">{t("subtitle")}</p>
          </div>
        </section>

        {/* Booking Info + Contact Form */}
        <section className="bg-gray-50">
          <div className="grid md:grid-cols-2 grid-cols-1">
            {/* Info Side */}
            <div className="w-full md:w-2/3 mx-auto flex flex-col justify-center py-20 md:py-0 px-5">
              <h2 className="text-2xl md:text-4xl font-bold mb-6 uppercase">
                {t("sectionTitle")}
              </h2>
              <p className="mb-4 text-lg md:text-xl font-semibold text-neutral-600">
                {t("sectionDescription")}
              </p>
              <ul className="list-disc list-inside mb-6">
                <li className="text-md md:text-lg font-semibold text-black">
                  {t("sectionList")[0]}
                </li>
                <li className="text-md md:text-lg font-semibold text-black">
                  {t("sectionList")[1]}
                </li>
                <li className="text-md md:text-lg font-semibold text-black">
                  {t("sectionList")[2]}
                </li>
                <li className="text-md md:text-lg font-semibold text-black">
                  {t("sectionList")[3]}
                </li>
              </ul>
              <p className="text-gray-600 text-md md:text-xl mb-10">
                {t("sectionContact")}{" "}
                <a
                  href="tel:+393714891806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold"
                >
                  +39 3714891806
                </a>
              </p>
              <div className="flex flex-col gap-4">
                <Link
                  href="tel:+393714891806"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="flex items-center justify-center gap-2 font-semibold text-md md:text-xl border border-blue-500 text-blue-500 w-full py-3 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer">
                    {t("sectionButtonLabel")} <MdArrowOutward size={20} />
                  </button>
                </Link>
                {/* <Link
                  href={t("downloadButtonLink")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="flex items-center justify-center gap-2 font-semibold text-md md:text-xl border border-blue-500 text-blue-500 w-full py-3 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer">
                    {t("downloadButtonLabel")} <MdArrowOutward size={20} />
                  </button>
                </Link> */}
              </div>
              <div style={{ marginTop: "14px", textAlign: "center" }}>
                <a
                  href="https://www.google.com/maps?q=42.120393, 15.497450"
                  target="_blank"
                >
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=42.120393, 15.497450&zoom=15&size=600x300&markers=color:red%7C42.120393, 15.497450&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                    alt="Mappa punto di ritrovo"
                    className="w-full max-w-full rounded-2xl border border-blue-600"
                  />
                </a>
                <p className="text-start mt-2 text-neutral-600">
                  <span className="text-red-600">*</span> {t("sectionMapNote")}
                </p>
                <div className="mt-5">
                  <FAQList questions={questions} searchBar={false} />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer locale={params.locale} />
    </>
  );
}
