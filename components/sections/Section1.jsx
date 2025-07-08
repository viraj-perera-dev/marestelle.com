'use client';

import { getMessages } from "@/lib/getMessages";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PiAsteriskSimpleBold } from "react-icons/pi";

export default function Section1({ params }) {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(params.locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [params.locale]);

  const tSection1 = (key) => messages?.HomePage?.section1?.[key] ?? key;

  if (!messages) return;

  return (
    <div className="w-full md:h-screen flex items-center justify-center bg-white px-5 py-10 z-0 overflow-hidden">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-start justify-between gap-10">
        {/* LEFT SIDE: Image and Title */}
        <div className="flex flex-col items-start gap-8 max-w-md">
          <h2 className="text-3xl font-bold text-neutral-800">{tSection1("title")}</h2>
          <Image
            loading="lazy"
            className="rounded-3xl h-full w-full object-cover z-40"
            width={500}
            height={500}
            src="/assets/sectionImages/DJI_0967.jpg"
            alt="barca"
          />
        </div>

        {/* RIGHT SIDE: Subtitle + Icons/Features */}
        <div className="flex flex-col md:gap-10 gap-5">
          <p className="text-xl max-w-xl z-30">{tSection1("subtitle")}</p>

          <div className="relative grid grid-cols-2 gap-5 md:gap-x-16 gap-y-10 my-10">
            <div className="flex flex-col items-start gap-4 z-30">
              <div className="bg-blue-100 p-2 rounded-full">
                {/* Replace with an actual icon if needed */}
                <span>🚤</span>
              </div>
              <div>
                <p className="font-semibold">{tSection1("listItem1")}</p>
                <p className="text-sm">{tSection1("subItem1")}</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 z-30">
              <div className="bg-blue-100 p-2 rounded-full">
                <span>🌍</span>
              </div>
              <div>
                <p className="font-semibold">{tSection1("listItem2")}</p>
                <p className="text-sm">
                  {tSection1("subItem2")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 z-30">
              <div className="bg-blue-100 p-2 rounded-full">
                <span>❤️</span>
              </div>
              <div>
                <p className="font-semibold">{tSection1("listItem3")}</p>
                <p className="text-sm">{tSection1("subItem3")}</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 z-30">
              <div className="bg-blue-100 p-2 rounded-full">
                <span>⭐</span>
              </div>
              <div>
                <p className="font-semibold">{tSection1("listItem4")}</p>
                <p className="text-sm">{tSection1("subItem4")}</p>
              </div>
            </div>
            <PiAsteriskSimpleBold className="absolute -top-[30rem] -left-[20rem] text-[70rem] text-neutral-50 z-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
