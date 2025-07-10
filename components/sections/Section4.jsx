'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import { getMessages } from '@/lib/getMessages';
import { useEffect, useState } from 'react';



export default function ExperiencesSection({ params }) {

  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(params.locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [params.locale]);

  const tSection4 = (key) => messages?.HomePage?.section4?.[key] ?? key;

  const experiences = [
    {
      id: tSection4("experiences")[0]?.id,
      title: tSection4("experiences")[0]?.title,
      description: tSection4("experiences")[0]?.description,
      image: '/assets/slider/image1.jpg',
      link: tSection4("experiences")[0]?.link,
    },
    {
      id: tSection4("experiences")[1]?.id,
      title: tSection4("experiences")[1]?.title,
      description: tSection4("experiences")[1]?.description,
      image: '/assets/slider/image2.jpg',
      link: tSection4("experiences")[1]?.link,
    },
    {
      id: tSection4("experiences")[2]?.id,
      title: tSection4("experiences")[2]?.title,
      description: tSection4("experiences")[2]?.description,
      image: '/assets/slider/image16.jpg',
      link: tSection4("experiences")[2]?.link,
    },
    {
      id: tSection4("experiences")[3]?.id,
      title: tSection4("experiences")[3]?.title,
      description: tSection4("experiences")[3]?.description,
      image: '/assets/slider/image4.jpg',
      link: tSection4("experiences")[3]?.link,
    },
  ];

  if (!messages) return;

  return (
    <section className="bg-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{tSection4("title")}</h2>
        <p className="text-neutral-600 text-lg mb-16 text-center">
          {tSection4("subtitle")}
        </p>

        <div className="space-y-16">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row justify-center items-center gap-8 border-b border-neutral-200 pb-10"
            >
              {/* Left: Text Content */}
              <div className="md:w-1/2 space-y-4">
                <span className="text-blue-500 font-semibold text-sm">/{item.id}</span>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="text-neutral-600">{item.description}</p>
                <Link
                  href={`${params.locale}/${item.link}`}
                  className="mt-2 inline-flex items-center gap-2 text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition"
                >
                  {tSection4("button")} <MdArrowOutward size={18} />
                </Link>
              </div>

              {/* Right: Image */}
              <div className="w-full md:w-1/2 max-w-sm h-56 md:h-64 relative rounded-xl overflow-hidden shadow-md">
                <Image
                  loading="lazy"
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
