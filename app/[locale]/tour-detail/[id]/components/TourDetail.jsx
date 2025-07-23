"use client";

import { getMessages } from "@/lib/getMessages";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import ContactSection from "@/components/sections/ContactSection";
import Link from "next/link";

export default function Section2({ locale, tourId }) {
  const [messages, setMessages] = useState(null);

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
  }


  if (!messages) return null;

  return (
    <>
      <div
        className="flex flex-row gap-4"
      >
        <Image
          src={selectedTour.image}
          alt="tour"
          width={1920}
          height={1080}
          className="object-cover h-screen sticky top-0 hidden md:block w-1/3"
        />
        <div className="w-full bg-white px-8 max-w-3xl relative md:rounded-xl py-36 w-2/3">
          <Link href={`/${locale}`} className="border-blue-500 border px-4 py-2 text-blue-500 hover:text-white hover:bg-blue-500 transition duration-300 rounded-full flex items-center gap-2 w-fit">
              <MdArrowBack size={20} />
              <span>{tSection2("backButton")}</span>
          </Link>
          <h2 className="text-3xl font-semibold text-gray-800 mt-10 mb-4">
            {selectedTour.name}
          </h2>

          <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
            <p>
              {selectedTour.description}
            </p>
            <p>
              {selectedTour.details}
            </p>
            <div className="grid grid-cols-1 gap-2 text-sm mt-4">
              <p>🕒 Orario: {selectedTour.guests}</p>
              <p>🗣️ Lingue: {selectedTour.dimension}</p>
              <p>⏳ Durata: {selectedTour.durata}</p>
            </div>

            <hr className="my-4" />

            <div>
              <p className="font-bold uppercase">{tSection2("priceListLabel")}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {selectedTour.priceList.map((item, index) => (
                  <>
                    <li className="font-semibold" key={index}>{item.title}</li>
                    <li key={index}>{item.adult}</li>
                    <li key={index}>{item.child}</li>
                  </>
                ))}
              </ul>
            </div>

            <hr className="my-4" />

            <div>
              <p className="font-bold uppercase">{tSection2("inclusoLabel")}</p>
              <ul className="list-disc list-inside mt-2">
                {selectedTour.incluso.map((item, index) => (
                  <li className="flex gap-2" key={index}>
                    {item.include ? <span className="w-2 h-2">✅</span> : <span className="w-2 h-2">❌</span>}
                    <span className="font-semibold ms-2">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold uppercase mt-4">{tSection2("necessarioLabel")}</p>
              <p className="mt-2 font-semibold">{selectedTour.necessario}</p>
            </div>

            <div>
              <p className="font-bold uppercase mt-4 text-red-700">{tSection2("altroLabel")}</p>
              <p className="list-disc list-inside mt-2 text-red-600">
                {tSection2("altro")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ContactSection params={locale} />
    </>
  );
}
