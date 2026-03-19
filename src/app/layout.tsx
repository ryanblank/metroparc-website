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
        {/* DAM Ops Attribution — captures UTMs, gclid, referrer → sessionStorage. Must load BEFORE Funnel DNI. */}
        <Script
          src="https://widgets.damoperations.com/attribution.js"
          strategy="afterInteractive"
        />
        {/* Funnel DNI — Dynamic Number Insertion for call tracking */}
        <Script
          src="https://integrations.funnelleasing.com/dni/v1/dni.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ApartmentComplexSchema />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
