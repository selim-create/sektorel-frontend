import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/hesabim/",
          "/giris",
          "/kayit",
          "/sifremi-unuttum",
          "/sifre-yenile",
          "/firma-ekle",
          "/ara",
          "/ajanda/olustur",
          "/ajanda/etkinlik-ekle",
          "/kariyer/ilan-ver",
          "/firsatlar/olustur",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
