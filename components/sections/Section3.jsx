'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { getMessages } from "@/lib/getMessages";
import { useEffect, useState } from 'react';

const imageUrls = [
    '/assets/slider/image1.jpg',
    '/assets/slider/image2.jpg',
    '/assets/slider/image13.jpg',
    '/assets/slider/image8.jpg',
    '/assets/slider/image4.jpg',

    '/assets/slider/image5.jpg',
    '/assets/slider/image11.jpg',
    '/assets/slider/image6.jpg',
    '/assets/slider/image10.jpg',
    '/assets/slider/image7.jpg',
    '/assets/slider/image9.jpg',
    '/assets/slider/image12.jpg',
    '/assets/slider/image3.jpg',
    '/assets/slider/image14.jpg',
    '/assets/slider/image15.jpg',
    '/assets/slider/image16.jpg',
    '/assets/slider/image17.jpg',
    '/assets/slider/image18.jpg',
    '/assets/slider/image19.jpg',
    '/assets/slider/image20.jpg',
    '/assets/slider/image21.jpg',
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
        <div className="px-6 py-10 md:py-36 z-0 bg-white">
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000 }}
                spaceBetween={20}
                slidesPerView="auto"
                className="w-full"
            >
                {imageUrls.map((url, index) => (
                    <SwiperSlide
                        key={index}
                        className="!w-auto flex items-center"
                    >
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
        </div>
    );
}
