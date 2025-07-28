"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getMessages } from "@/lib/getMessages";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const imageUrls = [
  "/assets/slider/image1.webp",
  "/assets/slider/image2.webp",
  "/assets/slider/image13.webp",
  "/assets/slider/image8.webp",
  "/assets/slider/image4.webp",
  "/assets/slider/image5.webp",
  "/assets/slider/image11.webp",
  "/assets/slider/image6.webp",
  "/assets/slider/image10.webp",
  "/assets/slider/image7.webp",
  "/assets/slider/image9.webp",
  "/assets/slider/image12.webp",
  "/assets/slider/image3.webp",
  "/assets/slider/image14.webp",
  "/assets/slider/image15.webp",
  "/assets/slider/image16.webp",
  "/assets/slider/image17.webp",
  "/assets/slider/image18.webp",
  "/assets/slider/image19.webp",
  "/assets/slider/image20.webp",
  "/assets/slider/image21.webp",
];

export default function Section3({ params }) {
  const [messages, setMessages] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageWidth, setImageWidth] = useState(500); // 500 + padding
  
  // Motion values for smooth control
  const x = useMotionValue(0);
  const baseX = useRef(0);
  const containerRef = useRef(null);
  const speed = 0.5;

  // Calculate the width of one complete set of images
  const singleSetWidth = imageUrls.length * imageWidth;
  
  // Create enough copies to ensure seamless infinite scroll
  const multipliedImages = [
    ...imageUrls,
    ...imageUrls,
    ...imageUrls,
    ...imageUrls,
    ...imageUrls
  ];

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(params.locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [params.locale]);

  useEffect(() => {
    // Set initial position to middle set to allow smooth scrolling in both directions
    const initialOffset = -singleSetWidth * 2;
    baseX.current = initialOffset;
    x.set(initialOffset);
  }, [singleSetWidth]);

  // Auto-scroll animation
  useAnimationFrame(() => {
    if (!messages || isDragging) return;

    baseX.current -= speed;
    
    // Seamless loop: when we've scrolled one full set, jump back by one set width
    // This creates the infinite effect without visible jumping
    if (baseX.current <= -singleSetWidth * 3) {
      baseX.current += singleSetWidth;
    }
    
    x.set(baseX.current);
  });

  // Handle drag constraints and seamless looping during drag
  const handleDrag = (event, info) => {
    const currentX = x.get();
    
    // Update baseX to match current position for smooth auto-scroll resume
    baseX.current = currentX;
    
    // Seamless loop during drag
    if (currentX <= -singleSetWidth * 4) {
      const newX = currentX + singleSetWidth;
      x.set(newX);
      baseX.current = newX;
    } else if (currentX >= -singleSetWidth) {
      const newX = currentX - singleSetWidth;
      x.set(newX);
      baseX.current = newX;
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    // Sync baseX with final drag position for smooth auto-scroll resume
    baseX.current = x.get();
  };

  const tSection3 = (key) => messages?.HomePage?.section3?.[key] ?? key;

  if (!messages) return null;

  return (
    <div className="overflow-hidden relative px-0 pt-10 md:pt-36 z-0 bg-white">
      <motion.div
        className="flex w-fit cursor-grab active:cursor-grabbing"
        ref={containerRef}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -singleSetWidth * 4, right: -singleSetWidth }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        transition={{
          type: "tween",
          ease: "linear",
          duration: 0
        }}
      >
        {multipliedImages.map((url, i) => (
          <div key={`${url}-${i}`} className="shrink-0 px-2">
            <Image
              src={url}
              alt={`Image ${i}`}
              width={500}
              height={500 }
              className="rounded-xl object-cover md:h-[400px] h-[250px] w-auto pointer-events-none"
              loading="eager"
              priority={i < 10}
              draggable={false}
            />
          </div>
        ))}
      </motion.div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center items-start space-y-5 md:space-y-0 md:py-20 py-10 px-4">
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