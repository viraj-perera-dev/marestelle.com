"use client";

import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/utils/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import ProgressIndicator from "./components/ProgressIndicator"; // adjust path if needed

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveMap() {
  const locale = useLocale();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!loading && itinerary.length > 0) {
      const hash = window.location.hash;

      if (hash.startsWith("#stop-")) {
        const index = parseInt(hash.replace("#stop-", ""), 10);
        const target = sectionsRef.current[index];

        if (target) {
          // Jump immediately to section without animation
          setTimeout(() => {
            target.scrollIntoView({ behavior: "auto" });
          }, 0); // Can even use 0ms delay
        }
      }
    }
  }, [loading, itinerary]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // set initially
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Normalize data to have coords: { lat, lng }
  useEffect(() => {
    async function fetchItinerary() {
      setLoading(true);
      const { data, error } = await supabase
        .from("itinerary")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching itinerary:", error);
        setItinerary([]);
      } else {
        // Transform lat/lng columns into coords object
        const normalized = data.map(({ lat, lng, ...rest }) => ({
          ...rest,
          coords: { lat, lng },
        }));
        setItinerary(normalized);
      }
      setLoading(false);
    }
    fetchItinerary();
  }, []);

  const containerStyle = {
    width: "100%",
    height: isMobile ? "60vh" : "100vh", // 50% height on mobile
  };

  const path = itinerary.map((stop) => stop.coords);

  const sectionsRef = useRef([]);

  // Setup ScrollTrigger only when both map and data are loaded
  useEffect(() => {
    if (!isLoaded || loading || itinerary.length === 0) return;

    const triggers = [];

    requestAnimationFrame(() => {
      const hash = window.location.hash;

      if (!hash.startsWith("#stop-")) {
        window.scrollTo(0, 0);
      }

      sectionsRef.current = sectionsRef.current.slice(0, itinerary.length);

      ScrollTrigger.defaults({
        snap: 1 / itinerary.length,
      });

      itinerary.forEach((_, i) => {
        const trigger = ScrollTrigger.create({
          trigger: sectionsRef.current[i],
          start: "top center",
          end: "bottom center",
          // markers: true,
          onEnter: () => {
            setActiveIndex(i);
            setVisibleMarkers((prev) => [...new Set([...prev, i])]);
          },
          onEnterBack: () => {
            setActiveIndex(i);
            setVisibleMarkers((prev) => [...new Set([...prev, i])]);
          },
          onLeaveBack: () => {
            setVisibleMarkers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(i);
              return [...newSet];
            });
          },
        });
        triggers.push(trigger);
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill()); // 💥 Clean everything!
    };
  }, [isLoaded, loading, itinerary]);

  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeIndex]);

  if (loading) return <div></div>;
  if (!itinerary.length) return <div></div>;
  if (!isLoaded) return <div></div>;

  return (
    <main>
      <section className="relative">
        {/* Fixed Google Map */}
        <div className="fixed top-0 right-0 w-full md:w-1/2 xl:w-2/3 h-full z-0 object-contain">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={path[activeIndex]}
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
                    animation={window.google.maps.Animation.DROP}
                    icon={{
                      url: `${
                        index === activeIndex
                          ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                          : "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                      }`,
                      scaledSize:
                        typeof window !== "undefined"
                          ? new window.google.maps.Size(50, 50)
                          : undefined,
                    }}
                  />
                )
            )}
          </GoogleMap>
        </div>

        {/* Overlay Info */}
        <div className="fixed md:top-0 bottom-0 left-0 md:h-auto md:w-1/2 xl:w-1/3 w-full h-auto mb-16 md:mb-0 z-40 bg-white">
          <div
            className="w-[80%] mx-auto h-full flex flex-col md:justify-center justify-start items-center"
            ref={contentRef}
          >
            {itinerary[activeIndex].image && (
              <Image
                src={`/assets/diario/${itinerary[activeIndex].image}`}
                alt={itinerary[activeIndex].title}
                width={500}
                height={500}
                className="rounded-lg object-cover h-[20rem] w-full hidden md:block"
              />
            )}
            <div className="mt-10 flex flex-col justify-center items-start me-auto w-full">
              <h2 className="md:text-4xl text-2xl font-bold mb-2">
                {itinerary[activeIndex].title}
              </h2>

              {/* Truncated Description */}
              <p
                className="text-gray-700 font-semibold md:text-xl line-clamp-5 mb-2"
                style={{ display: "-webkit-box", WebkitBoxOrient: "vertical" }}
              >
                {itinerary[activeIndex].description}
              </p>

              {/* Read More button (conditionally shown if text is long) */}
              {itinerary[activeIndex].description.length > 250 && (
                <Link
                  href={`/${locale}/diario-di-bordo/${itinerary[activeIndex].id}`}
                  className="text-blue-600 underline text-sm mt-1 cursor-pointer"
                >
                  Leggi tutto
                </Link>
              )}

              {/* Show "scroll" on first step */}
              {activeIndex === 0 && (
                <p className="text-blue-500 font-semibold md:text-xl mt-10 mb-4 text-center mx-auto animate-bounce">
                  Scroll to see the full itinerary ↓
                </p>
              )}

              {/* Show CTA buttons on last step */}
              {activeIndex === itinerary.length - 1 && (
                <div className="flex gap-4 mt-5 md:mt-10">
                  <Link
                    href={`/${locale}/`} 
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                  >
                    ← Home
                  </Link>
                  <Link
                    href={`/${locale}/contatti`} // customize your booking path
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Book the Experience
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Sections (drive scroll trigger) */}
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
