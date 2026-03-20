"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SITE_TAGLINE, ADDRESS, PHONE, SOCIAL_LINKS } from "@/lib/constants";

interface NavbarProps {
  onBookTourClick: () => void;
}

export default function Navbar({ onBookTourClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-10 left-0 right-0 z-[1000] flex justify-between items-center px-6 py-5 transition-all duration-300 ${
          isScrolled
            ? "bg-deep-ocean/95 backdrop-blur-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="max-w-[180px] transition-opacity duration-300 hover:opacity-80" onClick={closeMenu}>
          <Image
            src="/images/logos/MetroParc__Horizontal_cream.png"
            alt="Metro Parc Apartments in Hialeah FL"
            width={180}
            height={40}
            priority
            className="w-full h-auto"
          />
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side CTAs */}
        <div className="flex items-center gap-3">
          {/* Availability button - hidden on mobile */}
          <Link
            href="/availability"
            className="hidden md:inline-flex items-center bg-transparent text-clouds px-5 py-2.5 border border-clouds/40 rounded-full font-decorative text-[0.8rem] uppercase tracking-[0.1em] transition-all duration-300 hover:border-clouds/80 hover:bg-clouds/[0.08] no-underline"
          >
            Availability
          </Link>

          {/* Book a Tour button - hidden on mobile */}
          <button
            onClick={onBookTourClick}
            className="hidden md:inline-flex items-center bg-transparent text-clouds px-5 py-2.5 border border-clouds/40 rounded-full font-decorative text-[0.8rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:border-clouds/80 hover:bg-clouds/[0.08]"
          >
            Book a Tour
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className={`flex items-center gap-3 bg-transparent border border-clouds/40 rounded-full cursor-pointer px-5 py-2.5 text-clouds transition-all duration-300 hover:border-clouds/80 hover:bg-clouds/[0.08] ${
              isMenuOpen ? "z-[1001]" : ""
            }`}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {/* Hamburger lines */}
            <div className="flex flex-col gap-[5px] w-5">
              <span
                className={`w-full h-0.5 bg-current block transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-x-[5px] translate-y-[5px]" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current block transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current block transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 translate-x-[5px] -translate-y-[5px]" : ""
                }`}
              />
            </div>
            <span className="font-decorative text-[0.8rem] uppercase tracking-[0.12em]">
              {isMenuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Full-Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-[999] flex flex-col justify-center items-center px-8 pt-40 pb-8 transition-[clip-path] duration-500 ${
          isMenuOpen
            ? "[clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]"
            : "[clip-path:circle(0px_at_calc(100%-2.5rem)_2.5rem)]"
        }`}
        style={{
          background: "linear-gradient(160deg, var(--color-city-night) 0%, var(--color-city-night-muted) 100%)",
          transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
      >
        {/* Navigation Links */}
        <ul className="list-none text-center mb-12">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="my-5">
              <Link
                href={item.href}
                onClick={closeMenu}
                className={`text-clouds no-underline font-[family-name:var(--font-decorative)] text-[clamp(1rem,2.5vw,1.25rem)] font-normal tracking-[0.2em] uppercase relative inline-block pb-1 opacity-80 transition-opacity duration-300 hover:opacity-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-avocado after:transition-[width] after:duration-300 hover:after:w-full ${
                  pathname === item.href ? "opacity-100 after:w-full" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Book a Tour button in overlay */}
        <button
          onClick={() => {
            closeMenu();
            onBookTourClick();
          }}
          className="bg-avocado text-city-night px-8 py-3 border border-avocado rounded-full font-decorative text-[0.9rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-avocado-hover hover:border-avocado-hover mb-8"
        >
          Book a Tour
        </button>

        {/* Overlay Footer */}
        <div className="mt-auto text-center border-t border-white/20 pt-8 text-clouds">
          <p className="font-display text-2xl text-avocado mb-8">
            {SITE_TAGLINE}
          </p>
          <div className="font-body text-sm leading-[1.8] mb-6">
            <p>{ADDRESS.full}</p>
            <p>
              <a href={`tel:${PHONE.replace(/[^0-9]/g, "")}`} className="text-clouds no-underline hover:text-avocado transition-colors">
                {PHONE}
              </a>
            </p>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-clouds no-underline text-base transition-colors hover:text-avocado"
              aria-label="Follow Metro Parc on Facebook"
            >
              Facebook
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-clouds no-underline text-base transition-colors hover:text-avocado"
              aria-label="Follow Metro Parc on Instagram"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
