'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';

const experiences = [
  {
    id: '01',
    title: 'Sunset Cruises',
    description:
      'Take a moment to relax and soak in the breathtaking views of the ocean stretching out before you.',
    image: '/assets/slider/image1.jpg',
    link: '#',
  },
  {
    id: '02',
    title: 'Private Events',
    description:
      'Celebrate birthdays and anniversaries in style aboard a private yacht, with stunning views and great company.',
    image: '/assets/slider/image2.jpg',
    link: '#',
  },
  {
    id: '03',
    title: 'Corporate Retreats',
    description:
      'Wow your clients and strengthen your team connections. Unwind lasting impressions and success.',
    image: '/assets/slider/image3.jpg',
    link: '#',
  },
  {
    id: '04',
    title: 'Island Hopping',
    description:
      'Explore thrilling water activities like snorkeling and scuba diving on adventurous and relaxing getaways.',
    image: '/assets/slider/image4.jpg',
    link: '#',
  },
];

export default function ExperiencesSection() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Experiences We Offer</h2>
        <p className="text-neutral-600 text-lg mb-16">
          Tailored Experiences for Every Occasion
        </p>

        <div className="space-y-16">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-8 border-b border-neutral-200 pb-10"
            >
              {/* Left: Text Content */}
              <div className="md:w-1/2 space-y-4">
                <span className="text-blue-500 font-semibold text-sm">/{item.id}</span>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="text-neutral-600">{item.description}</p>
                <Link
                  href={item.link}
                  className="mt-2 inline-flex items-center gap-2 text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition"
                >
                  View Details <MdArrowOutward size={18} />
                </Link>
              </div>

              {/* Right: Image */}
              <div className="w-full md:w-1/2 max-w-sm h-56 md:h-64 relative rounded-xl overflow-hidden shadow-md">
                <Image
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
