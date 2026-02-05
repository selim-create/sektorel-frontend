// Sektörler (Mega Menü için)
export const SECTORS = [
  { id: 1, title: "İnşaat & Yapı", slug: "insaat-yapi" },
  { id: 2, title: "Tekstil & Moda", slug: "tekstil-moda" },
  { id: 3, title: "Otomotiv", slug: "otomotiv" },
  { id: 4, title: "Gıda & Tarım", slug: "gida-tarim" },
  { id: 5, title: "Bilişim & Yazılım", slug: "bilisim-yazilim" },
];

// Örnek Firmalar (Listeleme için)
export const COMPANIES = [
  {
    id: 1,
    title: "Yıldız Yapı Mimarlık",
    slug: "yildiz-yapi-mimarlik",
    sector: "İnşaat & Yapı",
    city: "İstanbul",
    district: "Kadıköy",
    isVerified: true, // Rozet için
    logo: "https://placehold.co/100x100/ea580c/white?text=Y",
    description: "30 yıllık tecrübemizle kentsel dönüşüm ve mimari projelerde hizmet veriyoruz.",
  },
  {
    id: 2,
    title: "SoftTech Yazılım Çözümleri",
    slug: "softtech-yazilim",
    sector: "Bilişim & Yazılım",
    city: "Ankara",
    district: "Çankaya",
    isVerified: false,
    logo: "https://placehold.co/100x100/111827/white?text=S",
    description: "Kurumsal firmalar için ERP ve CRM çözümleri üretiyoruz.",
  },
  {
    id: 3,
    title: "Ege Lojistik",
    slug: "ege-lojistik",
    sector: "Lojistik",
    city: "İzmir",
    district: "Alsancak",
    isVerified: true,
    logo: "https://placehold.co/100x100/ea580c/white?text=E",
    description: "Uluslararası taşımacılık ve gümrükleme hizmetleri.",
  },
];