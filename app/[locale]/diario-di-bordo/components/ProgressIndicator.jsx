"use client";
import React from "react";

export default function ProgressIndicator({ activeIndex, total }) {
  return (
    <div className="fixed right-4 top-[16dvh] md:top-1/2 md:-translate-y-1/2 z-40 flex flex-col items-center bg-white px-1 py-2 rounded-full">
      {Array.from({ length: total }).map((_, i) => {
        const isPast = i < activeIndex;
        const isCurrent = i === activeIndex;

        return (
          <div key={i} className="flex flex-col items-center">
            {/* Dot */}
            <div
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 transition-all duration-300 ${
                isCurrent
                  ? "bg-blue-600 border-blue-600 scale-110"
                  : isPast
                  ? "bg-blue-400 border-blue-400"
                  : "bg-white border-gray-400"
              }`}
            />

            {/* Line */}
            {i < total - 1 && (
              <div
                className={`md:h-6 w-px h-3 transition-colors duration-300 ${
                  i < activeIndex ? "bg-blue-400" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
