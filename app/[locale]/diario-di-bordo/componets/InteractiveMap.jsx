"use client";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/utils/supabaseClient";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveMap() {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

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
    height: isMobile ? "75vh" : "100vh", // 50% height on mobile
  };

  const path = itinerary.map((stop) => stop.coords);

  const sectionsRef = useRef([]);

  // Setup ScrollTrigger only when both map and data are loaded
  useEffect(() => {
    if (!isLoaded || loading || itinerary.length === 0) return;

    sectionsRef.current = sectionsRef.current.slice(0, itinerary.length);

    ScrollTrigger.defaults({
      snap: 1 / itinerary.length,
    });

    const triggers = itinerary.map((_, i) =>
      ScrollTrigger.create({
        trigger: sectionsRef.current[i],
        start: "top center",
        end: "bottom center",
        markers: true,
        onEnter: () => {
          setActiveIndex(i);
          setVisibleMarkers((prev) => {
            const newSet = new Set(prev);
            newSet.add(i);
            return [...newSet];
          });
        },
        onEnterBack: () => {
          setActiveIndex(i);
          setVisibleMarkers((prev) => {
            const newSet = new Set(prev);
            newSet.add(i);
            return [...newSet];
          });
        },
        onLeaveBack: () => {
          // Remove marker when scrolling back unless it's index 0
          setVisibleMarkers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(i);
            return [...newSet];
          });
        },
      })
    );

    return () => {
      triggers.forEach((t) => t.kill());
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

  if (loading) return <div>Loading itinerary...</div>;
  if (!itinerary.length) return <div>No itinerary found</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <>
      {/* Fixed Google Map */}
      <div className="fixed top-0 right-0 w-full md:w-2/3 h-2/3 md:h-full z-0 object-contain">
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
      <div className="fixed md:top-0 bottom-0 left-0 md:h-full md:w-1/3 w-full h-1/3 z-10 bg-white">
        <div
          className="w-full h-full flex flex-col justify-center items-center"
          ref={contentRef}
        >
          {itinerary[activeIndex].image && (
            <Image
              src={`/assets/diario/${itinerary[activeIndex].image}`}
              alt={itinerary[activeIndex].title}
              width={500}
              height={300}
              className="rounded-lg object-cover"
            />
          )}

          <h2 className="text-xl font-bold mb-2">
            {itinerary[activeIndex].title}
          </h2>
          <p className="text-gray-700">{itinerary[activeIndex].description}</p>
        </div>
      </div>

      {/* Scroll Sections (drive scroll trigger) */}
      <div className="relative z-20">
        {itinerary.map((_, i) => (
          <section
            key={i}
            ref={(el) => (sectionsRef.current[i] = el)}
            className="h-[100vh] w-full"
          />
        ))}
      </div>
    </>
  );
}
