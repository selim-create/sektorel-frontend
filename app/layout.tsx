import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/privacy/CookieConsent";
import JsonLd from "@/components/seo/JsonLd";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sektörel Ajanda | Türkiye'nin İş Platformu",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Türkiye genelindeki firmaları, sektörleri, haberleri, etkinlikleri, ticari fırsatları ve iş ilanlarını keşfedin.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: "Sektörel Ajanda | Türkiye'nin İş Platformu",
    description:
      "Firmalar, sektörler, haberler, etkinlikler ve ticari fırsatlar tek bir platformda.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sektörel Ajanda | Türkiye'nin İş Platformu",
    description:
      "Firmalar, sektörler, haberler, etkinlikler ve ticari fırsatlar tek bir platformda.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/sektorel-ajanda-logo.svg"),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    "@id": absoluteUrl("/#organization"),
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/ara")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <ApolloWrapper>
          <Header />
          <main className="min-h-screen container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </ApolloWrapper>
      </body>
    </html>
  );
}
