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
  APPLY_URL,
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
              <li>
                <a
                  href={APPLY_URL}
                  target="_blank"
                  className="text-clouds/80 no-underline text-sm font-light transition-colors hover:text-avocado"
                >
                  Apply Now
                </a>
              </li>
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
                  className="DCRPhone DCRPhoneHref text-clouds/80 no-underline transition-colors hover:text-avocado"
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

          {/* Regulatory Icons */}
          <div className="flex items-center gap-4 text-clouds/70">
            {/* Pet Friendly — paw print, filled */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-label="Pet Friendly">
              <ellipse cx="6.5" cy="6.5" rx="2.2" ry="2.8"/>
              <ellipse cx="12" cy="4.5" rx="2.2" ry="2.8"/>
              <ellipse cx="17.5" cy="6.5" rx="2.2" ry="2.8"/>
              <path d="M15.5 13.5c0-2.5-2-4-3.5-4s-3.5 1.5-3.5 4c0 1.8 1.2 3.5 2.5 4.5.7.5 1 1 1 1s.3-.5 1-1c1.3-1 2.5-2.7 2.5-4.5z"/>
            </svg>
            {/* Equal Housing Opportunity — house with = sign, filled */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-label="Equal Housing Opportunity">
              <path d="M12 2L1 10h3v12h16V10h3L12 2zM8 12.5h8v2H8v-2zm0 3.5h8v2H8v-2z"/>
            </svg>
            {/* Handicap Accessible — wheelchair symbol, filled */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-label="Handicap Accessible">
              <circle cx="11.5" cy="4" r="2.5"/>
              <path d="M14 9h-3.5l-.5 4h-1.5a5 5 0 104.5 5.5h-2a3 3 0 11-2.5-4.5H11l.5-3H14V9z"/>
              <path d="M14 15h2l1.5 4h2l-2-5h-3.5v1z"/>
            </svg>
            {/* Smoke Free — no smoking, filled */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" aria-label="Smoke Free Community">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="5" y="10.5" width="10" height="3" rx="0.5" fill="currentColor"/>
              <line x1="4.9" y1="19.1" x2="19.1" y2="4.9" stroke="currentColor" strokeWidth="2"/>
            </svg>
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
