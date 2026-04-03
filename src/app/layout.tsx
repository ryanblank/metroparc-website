import type { Metadata } from "next";
import { Montserrat, Josefin_Sans } from "next/font/google";
import Script from "next/script";
import ClientLayout from "@/components/layout/ClientLayout";
import { ApartmentComplexSchema } from "./structured-data";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Luxury Apartments for Rent in Hialeah FL | Metro Parc",
    template: "%s | Metro Parc",
  },
  description:
    "New luxury apartments 2 blocks from Metrorail & Tri-Rail in Hialeah, FL. Studios, 1 & 2-bedrooms with resort pool, fitness center & co-working. Tour today.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://metroparchialeah.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Metro Parc",
    images: [
      {
        url: "/images/exterior/exterior-render.jpg",
        width: 1200,
        height: 630,
        alt: "Metro Parc — Luxury Apartments for Rent in Hialeah FL",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${josefinSans.variable}`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PCMMZXZ2');`,
          }}
        />
        {/* DAM Ops Attribution — captures UTMs, gclid, referrer → sessionStorage (first-touch-wins). Inline to avoid external dependency & ensure pre-hydration timing. */}
        <Script
          id="dam-attribution"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var K='dam_attribution',P=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'];var s=new URLSearchParams(location.search),a={},f=!sessionStorage.getItem(K);P.forEach(function(k){var v=s.get(k);if(v)a[k]=v});if(document.referrer&&f)a.referrer=document.referrer;if(Object.keys(a).length>0||f){var e={};try{e=JSON.parse(sessionStorage.getItem(K)||'{}')}catch(x){e={}}P.forEach(function(k){if(a[k]&&!e[k])e[k]=a[k]});if(a.referrer&&!e.referrer)e.referrer=a.referrer;if(!e.landing_page)e.landing_page=location.pathname;if(!e.captured_at)e.captured_at=new Date().toISOString();sessionStorage.setItem(K,JSON.stringify(e))}})();`,
          }}
        />
        {/* Funnel DNI — Dynamic Number Insertion for call tracking */}
        <Script
          src="https://integrations.funnelleasing.com/dni/v1/dni.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PCMMZXZ2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ApartmentComplexSchema />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
