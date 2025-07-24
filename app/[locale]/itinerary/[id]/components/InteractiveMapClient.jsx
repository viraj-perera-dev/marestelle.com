"use client";

import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/utils/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import ProgressIndicator from "./ProgressIndicator";
import { GoArrowUpLeft } from "react-icons/go";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveMapClient({ locale, itineraryId }) {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch itinerary data
  useEffect(() => {
    async function fetchItinerary() {
      try {
        const { data, error } = await supabase
          .from("itinerary")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;


        const filtered = data
        .filter(item => item[`itinerary_${itineraryId}`] === true)
        .map(({ lat, lng, ...rest }) => ({
          ...rest,
          coords: { lat, lng },
        }));

        setItinerary(filtered);

      } catch (error) {
        console.error("Error fetching itinerary:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItinerary();
  }, []);

  // Handle URL hash navigation
  useEffect(() => {
    if (!loading && itinerary.length > 0) {
      const hash = window.location.hash;
      if (hash.startsWith("#stop-")) {
        const index = parseInt(hash.replace("#stop-", ""), 10);
        if (index >= 0 && index < itinerary.length) {
          setTimeout(() => {
            const element = document.getElementById(`stop-${index}`);
            if (element) {
              element.scrollIntoView({ behavior: "auto" });
            }
          }, 100);
        }
      }
    }
  }, [loading, itinerary]);

  const sectionsRef = useRef([]);
  const contentRef = useRef(null);

  // Setup ScrollTrigger
  useEffect(() => {
    if (!isLoaded || loading || itinerary.length === 0) return;

    const triggers = [];

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      itinerary.forEach((_, i) => {
        const element = sectionsRef.current[i];
        if (!element) return;

        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            setActiveIndex(i);
            setVisibleMarkers((prev) => [...new Set([...prev, i])]);
          },
          onEnterBack: () => {
            setActiveIndex(i);
          },
        });

        triggers.push(trigger);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [isLoaded, loading, itinerary]);

  // Animate content changes
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!itinerary.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>No itinerary data available.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const containerStyle = {
    width: "100%",
    height: isMobile ? "60vh" : "100vh",
  };

  return (
    <main>
      <section className="relative">
        {/* Fixed Google Map */}
        <div className="fixed top-0 right-0 w-full md:w-1/2 xl:w-2/3 h-full z-0">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={itinerary[activeIndex]?.coords || itinerary[0].coords}
            zoom={15}
            options={{
              disableDefaultUI: true,
              gestureHandling: "none",
              draggable: false,
              zoomControl: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
            }}
          >
            {itinerary.map(
              (stop, index) =>
                visibleMarkers.includes(index) && (
                  <Marker
                    key={stop.id}
                    position={stop.coords}
                    animation={2} // DROP animation
                    icon={{
                      url:
                        index === activeIndex
                          ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                          : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new window.google.maps.Size(50, 50),
                    }}
                  />
                )
            )}
          </GoogleMap>
        </div>

        {/* Content Overlay */}
        <div className="fixed md:top-0 bottom-0 left-0 md:h-auto md:w-1/2 xl:w-1/3 w-full h-auto mb-16 md:mb-0 z-40 bg-white">
          <div
            className="w-[80%] mx-auto h-full flex flex-col md:justify-center justify-start items-center py-4"
            ref={contentRef}
          >
            {itinerary[activeIndex]?.image && (
              <Image
                loading="lazy"
                src={`/assets/diario/${itinerary[activeIndex].image}`}
                alt={itinerary[activeIndex].title}
                width={500}
                height={500}
                className="rounded-lg object-cover h-[20rem] w-full hidden md:block"
              />
            )}

            <div className="mt-10 flex flex-col justify-center items-start w-full">
              <h2 className="md:text-4xl text-2xl font-bold mb-2">
                {itinerary[activeIndex]?.title}
              </h2>

              <p className="text-gray-600 md:text-xl line-clamp-4 mb-4">
                {itinerary[activeIndex]?.description}
              </p>

              {itinerary[activeIndex]?.description?.length > 250 && (
                <Link
                  href={`/${locale}/location/${itinerary[activeIndex].id}?itinerary=${itineraryId}`}
                  className="text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out flex items-center gap-2"
                >
                  <GoArrowUpLeft size={20} />
                  Leggi tutto
                </Link>
              )}

              {activeIndex === 0 && (
                <p className="text-blue-500 font-semibold md:text-xl mt-10 mb-4 text-center mx-auto animate-bounce">
                  Scroll to see the full itinerary ↓
                </p>
              )}

              {activeIndex === itinerary.length - 1 && (
                <div className="flex gap-4 mt-5 md:mt-10">
                  <Link
                    href={`/${locale}/`}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                  >
                    ← Home
                  </Link>
                  <Link
                    href={`/${locale}/contatti`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Book Experience
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Sections */}
        <div className="relative z-20">
          {itinerary.map((_, i) => (
            <section
              key={i}
              id={`stop-${i}`}
              ref={(el) => (sectionsRef.current[i] = el)}
              className="h-[100vh] w-full"
            />
          ))}
        </div>
      </section>

      <ProgressIndicator activeIndex={activeIndex} total={itinerary.length} />
    </main>
  );
}