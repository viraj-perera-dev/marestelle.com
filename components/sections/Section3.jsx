'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';

const imageUrls = [
    '/assets/slider/image1.jpg',
    '/assets/slider/image2.jpg',
    '/assets/slider/image13.jpg',
    '/assets/slider/image4.jpg',
    '/assets/slider/image8.jpg',
    '/assets/slider/image5.jpg',
    '/assets/slider/image11.jpg',
    '/assets/slider/image6.jpg',
    '/assets/slider/image10.jpg',
    '/assets/slider/image7.jpg',
    '/assets/slider/image9.jpg',
    '/assets/slider/image12.jpg',
    '/assets/slider/image3.jpg'
];

export default async function Section3() {
    return (
        <div className="px-6 py-36">
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
                        <div className="h-[350px] flex items-center">
                            <Image
                                src={url}
                                alt={`Slide ${index + 1}`}
                                height={350}
                                width={500} // You can put a dummy max width; it'll auto adjust
                                className="h-[350px] w-auto rounded-xl shadow-lg object-contain"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
