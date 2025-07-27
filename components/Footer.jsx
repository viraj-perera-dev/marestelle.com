"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaTiktok } from 'react-icons/fa';
import { getMessages } from "@/lib/getMessages";

export default function Footer({ locale }) {
  const [messages, setMessages] = useState(null);
  const lineRef = useRef(null); // ✅ Define missing ref

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [locale]);


  const tFooter = (key) => messages?.Footer?.[key] ?? key;

  if (!messages) return null; // ✅ Return null instead of undefined


  return (
    <footer className="relative w-full bg-[#f8fafc] text-[#1e293b] py-10 px-6 lg:px-20 border-t border-slate-200">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-10">
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold tracking-wide uppercase mb-2">
            {tFooter("title")}
          </h2>
          <p className="text-base text-gray-600 italic mb-2">
            {tFooter("subtitle")}
          </p>
          <p className="text-sm lg:text-base mb-1">Via Tramontana 2, 71040 Isole Tremiti (FG), Italia</p>
          <p className="text-sm lg:text-base mb-1">P.IVA 04356440711 - REA FG-321401</p>
          <p className="text-sm lg:text-base mb-1">riccardodenittis@pec.it</p>
          <hr
            className="border-t border-[#2c5666] my-6 transition-all duration-500"
          />

          <div className="flex flex-wrap gap-4 text-xl">
            <Link
              href="https://www.facebook.com/tremitimarestelle/"
              target="_blank"
              className="transition-opacity duration-1000 animation-footer-text hover:text-blue-600"
            >
              <FaFacebook />
            </Link>
            <Link
              href="https://www.instagram.com/marestelle_isoletremiti/"
              target="_blank"
              className="transition-opacity duration-1500 animation-footer-text hover:text-pink-500"
            >
              <FaInstagram />
            </Link>
            <Link
              href="https://www.tiktok.com/@marestelle_isoletremiti?_t=ZN-8xuOC42K7CI&_r=1"
              target="_blank"
              className="transition-opacity duration-2000 animation-footer-text hover:text-pink-600"
            >
              <FaTiktok />
            </Link>
          </div>
        </div>

        {/* <div className="flex flex-col text-sm lg:text-base space-y-2">
          <Link href="/privacy-policy" className="hover:underline animation-footer-text transition-opacity duration-2000">{tFooter("privacy") || "Privacy Policy"}</Link>
          <Link href="/terms-of-service" className="hover:underline animation-footer-text transition-opacity duration-2500">{tFooter("terms") || "Termini di Servizio"}</Link>
          <Link href="/contatti" className="hover:underline animation-footer-text transition-opacity duration-3000">{tFooter("contact") || "Contattaci"}</Link>
        </div> */}
      </div>

      <div className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} De Nittis Riccardo – Tutti i diritti riservati
      </div>
    </footer>
  );
}
