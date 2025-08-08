"use client";

import { getMessages } from "@/lib/getMessages";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import ContactSection from "@/components/sections/ContactSection";
import Link from "next/link";

export default function Section2({ locale, tourId }) {
  const [messages, setMessages] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAltro, setShowAltro] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [locale]);

  const tSection2 = (key) => messages?.HomePage?.section2?.[key] ?? key;

  const selectedTour = {
    id: tSection2("fleet")[Number(tourId)]?.id,
    name: tSection2("fleet")[Number(tourId)]?.name,
    description: tSection2("fleet")[Number(tourId)]?.description,
    guests: tSection2("fleet")[Number(tourId)]?.guests,
    dimension: tSection2("fleet")[Number(tourId)]?.dimension,
    image: tSection2("fleet")[Number(tourId)]?.image,
    link: tSection2("fleet")[Number(tourId)]?.link,
    necessario: tSection2("fleet")[Number(tourId)]?.necessario,
    details: tSection2("fleet")[Number(tourId)]?.details,
    priceList: tSection2("fleet")[Number(tourId)]?.priceList,
    durata: tSection2("fleet")[Number(tourId)]?.durata,
    incluso: tSection2("fleet")[Number(tourId)]?.incluso,
    altro: tSection2("altro")?.altro,
  };

  if (!messages) return null;

  return (
    <>
      <div className="flex flex-row gap-4">
        <Image
          src={selectedTour.image || '/assets/sectionImages/DJI_0977.webp'}
          alt="tour"
          width={1920}
          height={1080}
          className="object-cover h-screen sticky top-0 hidden md:block w-1/3"
        />
        <div className="w-full bg-white px-8 max-w-3xl relative md:rounded-xl py-36 w-2/3">
          <Link
            href={`/${locale}`}
            className="border-blue-500 border px-4 py-2 text-blue-500 hover:text-white hover:bg-blue-500 transition duration-300 rounded-full flex items-center gap-2 w-fit"
          >
            <MdArrowBack size={20} />
            <span>{tSection2("backButton")}</span>
          </Link>
          <h2 className="text-3xl font-semibold text-gray-800 mt-10 mb-4">
            {selectedTour.name}
          </h2>

          <hr className="my-4 border-gray-200" />

          <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
            <p>{selectedTour.description}</p>
            {showDetails ? (
              <>
                <p>{selectedTour.details}</p>
                <button
                  className="cursor-pointer border-neutral-500 border px-10 py-1 text-neutral-500 rounded-full flex items-center gap-2 w-fit"
                  onClick={() => setShowDetails(false)}
                >
                  {tSection2("readLess")}
                </button>
              </>
            ) : (
              <button
                className="cursor-pointer border-neutral-500 border px-10 py-1 text-neutral-500 rounded-full flex items-center gap-2 w-fit"
                onClick={() => setShowDetails(true)}
              >
                {tSection2("readMore")}
              </button>
            )}
            <hr className="my-4 border-gray-200" />

            <p className="font-bold uppercase">{tSection2("information")}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mt-4">
              <p>🕒 Orario: {selectedTour.guests}</p>
              <p>🗣️ Lingue: IT - EN</p>
              <p>⏳ Durata: {selectedTour.durata}</p>
            </div>

            <hr className="my-4 border-gray-200" />

            <div>
              <p className="font-bold uppercase">{tSection2("resume")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                <ul className="list-disc list-inside mt-2">
                  {selectedTour.incluso.map((item, index) => (
                    <li className="flex gap-2" key={index}>
                      {item.include && <span className="w-2 h-2">✅</span>}
                      <span className="font-semibold ms-2">
                        {item.include && item.title}
                      </span>
                    </li>
                  ))}
                </ul>
                <ul className="list-disc list-inside mt-2">
                  {selectedTour.incluso.map((item, index) => (
                    <li className="flex gap-2" key={index}>
                      {!item.include && <span className="w-2 h-2">❌</span>}
                      <span className="font-semibold ms-2">
                        {!item.include && item.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="font-bold uppercase mt-4">
                {tSection2("necessarioLabel")}
              </p>
              <ul className="mt-2 font-semibold text-gray-700 flex gap-5">
                {selectedTour.necessario.map((item, index) => (
                  <li key={index}>🔹{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold uppercase mt-4 text-red-700">
                {tSection2("altroLabel")}
              </p>
              <p
                className={`list-disc list-inside mt-2 text-red-600 ${
                  showAltro ? "" : "line-clamp-2"
                }`}
              >
                {tSection2("altro")}
              </p>
              <button
                className="cursor-pointer border-neutral-500 border px-10 py-1 text-neutral-500 rounded-full flex items-center gap-2 w-fit mt-5"
                onClick={() => setShowAltro(!showAltro)}
              >
                {showAltro ? tSection2("readLess") : tSection2("readMore")}
              </button>
            </div>

            <hr className="my-4 border-gray-200" />

            <div className="mt-6">
              <p className="font-bold uppercase text-lg mb-4">
                {tSection2("priceListLabel")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedTour.priceList.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white"
                  >
                    <h3 className="font-bold text-primary text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-700">
                      {tSection2("adult")}:{" "}
                      <span className="font-semibold">{item.adult}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {tSection2("child")}:{" "}
                      <span className="font-semibold">{item.child}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactSection params={locale} />
    </>
  );
}
