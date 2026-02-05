import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ApolloWrapper } from "@/lib/apollo-wrapper"; // Wrapper eklendi

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sektörel Ajanda | Türkiye'nin İş Platformu",
  description: "Firmalar, haberler, etkinlikler ve ticari fırsatlar tek bir noktada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ApolloWrapper>
          <Header />
          <main className="min-h-screen container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}