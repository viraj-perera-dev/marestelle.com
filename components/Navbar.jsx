"use client";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { usePathname } from "next/navigation"; // Get current route
import { useEffect, useRef, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import routes from "@/navbarRoutes";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdOutlineArrowDropDown } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoMdPaperPlane } from "react-icons/io";

export default function Navbar({ locale }) {
  const pathname = usePathname(); // Get current route
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenAnimation, setMenuOpenAnimation] = useState(false);
  const [menuItemShow, setMenuItemShow] = useState(false);
  const t = useTranslations("Navbar");
  const router = useRouter();
  const { locales } = routing;

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  // Function to check active link
  const isActive = (href) =>
    pathname === href ? "underline-animate-active" : "underline-animate";

  const openMenu = () => {
    setMenuOpen(true);
    setTimeout(() => {
      setMenuOpenAnimation(true);
    }, 500);
    setTimeout(() => {
      setMenuItemShow(true);
    }, 1300);
  };

  const closeMenu = () => {
    setMenuOpenAnimation(false);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuItemShow(false);
    }, 1000);
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLocaleChange = (newLocale) => {
    setIsOpen(false);
    const segments = pathname.split("/").filter(Boolean);
    if (locales.includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    const newPath = "/" + segments.join("/");
    router.push(newPath);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Link
        href="/"
        className="text-negative fixed top-6 md:top-5 left-5 md:left-26 z-[999] cursor-pointer"
      >
        <Image
          priority
          src="/assets/logo/logo_max_white.png"
          className={`md:w-46 md:h-auto w-32 h-auto object-contain`}
          alt="cloud"
          width={500}
          height={500}
        />
      </Link>
      <div className="flex justify-center">
        {/* Mobile Navbar Header */}
        <div className="fixed top-0 w-full md:w-[90%] z-50 h-36 flex justify-end items-center p-5 text-black">
          <div className="flex items-center gap-2 md:gap-5">
            <div className="hidden md:block">
              <button className="bg-white py-3 px-5 rounded-full flex items-center gap-2 w-full text-md text-gray-800 border border-gray-300 shadow-sm hover:text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                {t("Contact")}
                <IoMdPaperPlane className="text-2xl cursor-pointer" />
              </button>
            </div>
            <div className="">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white py-3 px-5 rounded-full flex items-center gap-2 w-full text-sm text-gray-800 border border-gray-300 shadow-sm hover:text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locale.toUpperCase()}
                <MdOutlineArrowDropDown className="text-2xl cursor-pointer" />
              </button>
              {isOpen && (
                <ul className="absolute w-[5.5rem] bg-white z-10 mt-1  border border-gray-300 rounded-md shadow-lg  overflow-auto">
                  {locales.map((loc) => (
                    <li
                      key={loc}
                      onClick={() => handleLocaleChange(loc)}
                      className="px-4 py-2 text-sm text-gray-700 hover:text-black bg-blue-100 cursor-pointer transition"
                    >
                      {loc.toUpperCase()}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              className="bg-white p-3 rounded-full cursor-pointer border border-gray-300 shadow-sm"
              onClick={openMenu}
            >
              <CgMenuLeft className="text-2xl text-black" />
            </div>
          </div>
        </div>
        {/* Mobile Sidebar Menu */}
        {menuOpen && (
          <div
            className={`fixed top-0 right-0 w-full h-full bg-white text-black z-[9999] transition-transform duration-700 ease-in-out transform overflow-hidden ${
              menuOpenAnimation ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <IoMdClose
              className="absolute top-5 right-5 md:top-10 md:right-10 text-3xl cursor-pointer"
              onClick={closeMenu}
            />

            {menuItemShow && (
              <ul className="flex flex-col items-start gap-5 md:gap-8 p-10 md:ps-20 mt-20">
                {routes.map((route) => (
                  <li
                    key={route.path}
                    data-aos="fade-right"
                    data-aos-duration={route.duration}
                  >
                    <Link
                      href={route.path}
                      locale={locale}
                      className={`uppercase w-full text-3xl md:text-6xl font-semibold ${isActive(
                        route.path
                      )} hover:text-black text-blue-500`}
                      onClick={closeMenu}
                    >
                      {t(route.name)}
                    </Link>
                  </li>
                ))}
                <li data-aos="fade-right" data-aos-duration="2500">
                  <Link
                    href={`/login`}
                    target="_blank"
                    className={`uppercase w-full text-3xl md:text-6xl font-semibold hover:text-black text-blue-500`}
                    onClick={closeMenu}
                  >
                    Area Riservata
                  </Link>
                </li>
              </ul>
            )}

            <div
              className={`ocean transition-opacity duration-3000 ease-in-out ${
                menuOpenAnimation ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="wave"></div>
              <div className="wave wave2"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
