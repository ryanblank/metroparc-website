import Image from "next/image";
import Link from "next/link";
import {
  SITE_TAGLINE,
  ADDRESS,
  PHONE,
  EMAIL,
  DIRECTIONS_URL,
  OFFICE_HOURS,
  NAV_ITEMS,
  SOCIAL_LINKS,
  FOOTER_LEGAL_LINKS,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-city-night text-clouds">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top: Tagline */}
        <div className="text-center mb-12">
          <p className="font-display text-[clamp(2rem,4vw,3rem)] text-avocado-light">
            {SITE_TAGLINE}
          </p>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Quick Links */}
          <div>
            <h3 className="font-decorative text-xs tracking-[0.2em] text-calm-waves mb-6">
              Quick Links
            </h3>
            <ul className="list-none space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-clouds/80 no-underline text-sm font-light transition-colors hover:text-avocado"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h3 className="font-decorative text-xs tracking-[0.2em] text-calm-waves mb-6">
              Contact
            </h3>
            <div className="space-y-3 text-sm font-light">
              <p className="text-clouds/80">
                {ADDRESS.street}
                <br />
                {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
              </p>
              <p>
                <a
                  href={`tel:${PHONE.replace(/[^0-9]/g, "")}`}
                  className="text-clouds/80 no-underline transition-colors hover:text-avocado"
                >
                  {PHONE}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-clouds/80 no-underline transition-colors hover:text-avocado"
                >
                  {EMAIL}
                </a>
              </p>
              <p>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-avocado no-underline transition-colors hover:text-avocado-light"
                >
                  Get Directions &rarr;
                </a>
              </p>
            </div>
          </div>

          {/* Column 3: Office Hours */}
          <div>
            <h3 className="font-decorative text-xs tracking-[0.2em] text-calm-waves mb-6">
              Office Hours
            </h3>
            <div className="space-y-2 text-sm font-light">
              {OFFICE_HOURS.map((schedule) => (
                <div key={schedule.days} className="flex justify-between text-clouds/80">
                  <span>{schedule.days}</span>
                  <span>{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-4">
            <Image
              src="/images/logos/MetroParc__Logo Mark_cream.png"
              alt="Metro Parc"
              width={32}
              height={32}
              className="opacity-60"
            />
            <span className="text-xs text-clouds/50">
              &copy; {new Date().getFullYear()} Metro Parc. All Rights Reserved.
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-clouds/50 text-xs no-underline transition-colors hover:text-avocado"
              aria-label="Follow Metro Parc on Facebook"
            >
              Facebook
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-clouds/50 text-xs no-underline transition-colors hover:text-avocado"
              aria-label="Follow Metro Parc on Instagram"
            >
              Instagram
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-clouds/50 text-xs no-underline transition-colors hover:text-clouds/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
