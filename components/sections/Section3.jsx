"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { getMessages } from "@/lib/getMessages";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";


const imageUrls = [
  "/assets/slider/image1.jpg",
  "/assets/slider/image2.jpg",
  "/assets/slider/image13.jpg",
  "/assets/slider/image8.jpg",
  "/assets/slider/image4.jpg",

  "/assets/slider/image5.jpg",
  "/assets/slider/image11.jpg",
  "/assets/slider/image6.jpg",
  "/assets/slider/image10.jpg",
  "/assets/slider/image7.jpg",
  "/assets/slider/image9.jpg",
  "/assets/slider/image12.jpg",
  "/assets/slider/image3.jpg",
  "/assets/slider/image14.jpg",
  "/assets/slider/image15.jpg",
  "/assets/slider/image16.jpg",
  "/assets/slider/image17.jpg",
  "/assets/slider/image18.jpg",
  "/assets/slider/image19.jpg",
  "/assets/slider/image20.jpg",
  "/assets/slider/image21.jpg",
];

export default function Section3({ params }) {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(params.locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [params.locale]);

  const tSection3 = (key) => messages?.HomePage?.section3?.[key] ?? key;

  if (!messages) return;

  return (
    <div className="px-6 pt-10 md:pt-36 z-0 bg-white">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        spaceBetween={20}
        slidesPerView="auto"
        className="w-full"
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index} className="!w-auto flex items-center">
            <div className="md:h-[350px] flex items-center">
              <Image
                src={url}
                alt={`Slide ${index + 1}`}
                height={350}
                width={500} // You can put a dummy max width; it'll auto adjust
                className="md:h-[350px] h-[250px] w-auto rounded-xl object-contain"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center items-start space-y-5 md:space-y-0 md:py-20 py-10 px-4 my-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:justify-between md:items-center items-start md:gap-20 gap-5">
          <div>
            <h2 className="md:text-4xl text-2xl font-bold text-neutral-800">
              {tSection3("title")}
            </h2>
            <p className="md:text-lg text-md text-neutral-600">
              {tSection3("subtitle")}
            </p>
          </div>
          <div className="flex space-x-4 pt-2">
            <Link href="https://www.instagram.com/marestelle_isoletremiti/" target="_blank">
              <Instagram className="w-10 h-10 text-pink-500 hover:text-pink-500 transition" />
            </Link>
            <Link href="https://www.tiktok.com/@marestelle_isoletremiti?_t=ZN-8xuOC42K7CI&_r=1" target="_blank">
              <FaTiktok className="w-10 h-10 text-black hover:text-black transition" />
            </Link> 
            <Link href="https://www.facebook.com/tremitimarestelle/" target="_blank">
              <Facebook className="w-10 h-10 text-blue-600 hover:text-blue-600 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
