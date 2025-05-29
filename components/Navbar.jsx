"use client";

import { Link } from "@/i18n/navigation";
import { routing } from '@/i18n/routing';
import { usePathname } from "next/navigation"; // Get current route
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import routes from "@/navbarRoutes";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname(); // Get current route
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenAnimation, setMenuOpenAnimation] = useState(false);
  const [menuItemShow, setMenuItemShow] = useState(false);
  const locale = useLocale(); 
  const t = useTranslations("Navbar");
  const router = useRouter();
  const { locales } = routing;

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

  return (
    <>
      <div className="block md:hidden">
        {/* Mobile Navbar Header */}
        <div className="absolute top-0 w-full z-50 h-20 flex justify-between items-center p-5 text-black">
          <Link href="/">Logo here</Link>
          <RxHamburgerMenu
            className="text-2xl cursor-pointer text-black"
            onClick={openMenu}
          />
        </div>
        {/* Mobile Sidebar Menu */}
        {menuOpen && (
          <div
            className={`fixed top-0 left-0 w-full h-full bg-black text-white opacity-0 transform transition-all duration-1000 ease-in-out z-50 flex items-center justify-center ${
              menuOpenAnimation
                ? "opacity-100 translate-y-0 h-screen"
                : "-translate-y-full opacity-0"
            }`}
            style={{ transitionProperty: "transform, opacity" }}
          >
            <IoMdClose
              className="absolute top-5 right-5 text-3xl cursor-pointer"
              onClick={closeMenu}
            />
            {menuItemShow && (
              <ul className="flex flex-col items-center gap-5 p-5 ">
                {routes.map((route) => (
                  <li
                    key={route.path}
                    data-aos="fade-right"
                    data-aos-duration={route.duration}
                  >
                    <Link
                      href={route.path}
                      locale={locale}
                      className={`uppercase ${isActive(route.path)}`}
                      onClick={closeMenu}
                    >
                      {t(route.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {/* Desktop Navbar Header */}
      <div className="hidden md:block">
        {/* bg-gradient-to-b from-white/60 to-transparent */}
        <div
          className={`text-negative-remove absolute z-40 top-0 left-0 w-full transition-transform duration-300 h-44`}
        >
          <div
            className={`flex justify-between items-center p-8 md:p-5 text-black`}
          >
            Logo here
          </div>
        </div>

        <div
          className={`text-negative-remove absolute z-50 top-0 left-0 w-full transition-transform duration-300 `}
        >
          <div className={`flex justify-end items-center py-10`}>
            <nav className="flex justify-end items-center gap-6 mx-6 text-black">
              {routes.map((route) => (
                
                  <Link
                    key={route.path}
                    href={route.path}
                    locale={locale}
                    className={`uppercase ${isActive(route.path)}`}
                  >
                    {t(route.name)}
                  </Link>
              
              ))}
              <select
                className="border p-1 text-black"
                value={locale}
                onChange={(e) => {
                  const newLocale = e.target.value;
                  const segments = pathname.split("/").filter(Boolean);
                  if (locales.includes(segments[0])) {
                    segments[0] = newLocale;
                  } else {
                    segments.unshift(newLocale);
                  }
                  const newPath = "/" + segments.join("/");
                  router.push(newPath);
                }}
              >
                {locales.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc.toUpperCase()}
                  </option>
                ))}
              </select>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
