'use client';

import { getMessages } from "@/lib/getMessages";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

export default function Section2({ params }) {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(params.locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [params.locale]);

  const tSection2 = (key) => messages?.HomePage?.section2?.[key] ?? key;

  const fleet = [
    {
      name: tSection2("fleet")[0].name,
      description: tSection2("fleet")[0].description,
      guests: tSection2("fleet")[0].guests,
      dimension: tSection2("fleet")[0].dimension,
      image: "/assets/sectionImages/DJI_0977.jpg",
      link: "/",
    },
    {
      name: tSection2("fleet")[1].name,
      description: tSection2("fleet")[1].description,
      guests: tSection2("fleet")[1].guests,
      dimension: tSection2("fleet")[1].dimension,
      image: "/assets/barca/Motonave-Victor_-6.jpg",
      link: "https://motonavevictor.it/it/",
    },
  ];

  return (
    <div className="w-full bg-white">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center items-start space-y-5 md:space-y-0 md:py-20 py-10 bg-neutral-50 px-4">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:justify-between md:items-center items-start md:gap-20 gap-5">
            <div>
              <h2 className="md:text-4xl text-2xl font-bold text-neutral-800">{tSection2("title")}</h2>
              <p className="md:text-lg text-md text-neutral-600">{tSection2("subtitle")}</p>
            </div>
            <Link href={`${params.locale}/contatti`} className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition">
              {tSection2("button")}
            </Link>
          </div>

        </div>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-10">
          {fleet.map((yacht, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-3xl flex flex-col gap-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center items-center gap-5 md:gap-10">
                <div className="flex flex-col justify-between gap-4 h-full">
                  <div className="flex flex-col gap-2">
                    <h3 className="md:text-2xl text-xl font-semibold">{yacht.name}</h3>
                    <p className="text-neutral-600">{yacht.description}</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-white p-2 rounded-full shadow">
                        👤
                      </span>
                      <p>{yacht.guests}</p>
                    </div>
                    <hr className="border-neutral-300" />
                    <div className="flex items-center gap-4">
                      <span className="bg-white p-2 rounded-full shadow">
                        📏
                      </span>
                      <p>{yacht.dimension}</p>
                    </div>
                  </div>
                  <Link
                    className="self-start text-blue-600 font-medium flex items-center gap-2 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer"
                    href={yacht.link}
                  >
                    {tSection2("fleet")[index].linkLabel} <MdArrowOutward size={20} />
                  </Link>
                </div>
                <div className="w-[15rem] h-[25rem] md:w-[25rem] md:h-[30rem]">
                  <Image
                    src={yacht.image}
                    alt={yacht.name}
                    width={500}
                    height={500}
                    className="rounded-3xl h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
