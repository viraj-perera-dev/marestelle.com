'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';
import { Swiper as SwiperType } from 'swiper';
import { getMessages } from '@/lib/getMessages';
import 'swiper/css';



export default function Section5({ params }) {
  const swiperRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(params.locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [params.locale]);

  const tSection5 = (key) => messages?.HomePage?.section5?.[key] ?? key;

  const testimonials = [
    {
      name: tSection5("testimonials")[0].name,
      location: tSection5("testimonials")[0].location,
      image: tSection5("testimonials")[0].image,
      text: tSection5("testimonials")[0].text,
      title: tSection5("testimonials")[0].title,
      date: tSection5("testimonials")[0].date,
      rating: tSection5("testimonials")[0].rating,
    },
    {
      name: tSection5("testimonials")[1].name,
      location: tSection5("testimonials")[1].location,
      image: tSection5("testimonials")[1].image,
      text: tSection5("testimonials")[1].text,
      title: tSection5("testimonials")[1].title,
      date: tSection5("testimonials")[1].date,
      rating: tSection5("testimonials")[1].rating,
    },
    {
      name: tSection5("testimonials")[2].name,
      location: tSection5("testimonials")[2].location,
      image: tSection5("testimonials")[2].image,
      text: tSection5("testimonials")[2].text,
      title: tSection5("testimonials")[2].title,
      date: tSection5("testimonials")[2].date,
      rating: tSection5("testimonials")[2].rating,
    },
    {
      name: tSection5("testimonials")[3].name,
      location: tSection5("testimonials")[3].location,
      image: tSection5("testimonials")[3].image,
      text: tSection5("testimonials")[3].text,
      title: tSection5("testimonials")[3].title,
      date: tSection5("testimonials")[3].date,
      rating: tSection5("testimonials")[3].rating,
    },
    {
      name: tSection5("testimonials")[4].name,
      location: tSection5("testimonials")[4].location,
      image: tSection5("testimonials")[4].image,
      text: tSection5("testimonials")[4].text,
      title: tSection5("testimonials")[4].title,
      date: tSection5("testimonials")[4].date,
      rating: tSection5("testimonials")[4].rating,
    },
    {
      name: tSection5("testimonials")[5].name,
      location: tSection5("testimonials")[5].location,
      image: tSection5("testimonials")[5].image,
      text: tSection5("testimonials")[5].text,
      title: tSection5("testimonials")[5].title,
      date: tSection5("testimonials")[5].date,
      rating: tSection5("testimonials")[5].rating,
    },
  ];

  if (!messages) return;

  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">{tSection5("title")}</h2>
        <p className="text-neutral-500 text-lg mt-2">
          {tSection5("subtitle")}
        </p>

        <div className="mt-16">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-blue-50 rounded-3xl px-6 py-10 flex flex-col items-center text-center shadow-sm h-full mx-auto max-w-md">
                  <Image
                    loading="lazy"
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover mb-4"
                  />
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-sm text-neutral-500">{item.location}</p>
                  <p className="mt-4 text-neutral-800 text-xl font-semibold line-clamp-1 hover:line-clamp-none transition duration-500">{item.title}</p>
                  <p className="mt-4 text-neutral-800 line-clamp-3 cursor-pointer hover:line-clamp-none transition duration-500">{item.text}</p>
                  <div className="flex justify-between items-center w-full mt-6 text-sm text-neutral-600 px-2">
                    <span>{item.date}</span>
                    <span className="flex items-center gap-1 text-yellow-500 font-medium">
                      <FaStar className="text-yellow-500" /> {item.rating}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination & Arrows */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-blue-100 transition"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <IoIosArrowBack />
            </button>
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full transition ${
                  i === activeIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
            <button
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-blue-100 transition"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
