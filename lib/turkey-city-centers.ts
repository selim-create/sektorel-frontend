export type Coordinates = [number, number];

const CITY_CENTERS: Record<string, Coordinates> = {
  adana: [37.0, 35.3213],
  adiyaman: [37.7648, 38.2786],
  afyonkarahisar: [38.7507, 30.5567],
  agri: [39.7191, 43.0503],
  aksaray: [38.3687, 34.037],
  amasya: [40.6499, 35.8353],
  ankara: [39.9334, 32.8597],
  antalya: [36.8969, 30.7133],
  ardahan: [41.1105, 42.7022],
  artvin: [41.1828, 41.8183],
  aydin: [37.856, 27.8416],
  balikesir: [39.6484, 27.8826],
  bartin: [41.6344, 32.3375],
  batman: [37.8812, 41.1351],
  bayburt: [40.2552, 40.2249],
  bilecik: [40.0567, 30.0665],
  bingol: [38.8853, 40.498],
  bitlis: [38.4006, 42.1095],
  bolu: [40.576, 31.5788],
  burdur: [37.7203, 30.2908],
  bursa: [40.195, 29.06],
  canakkale: [40.1553, 26.4142],
  cankiri: [40.6013, 33.6134],
  corum: [40.5506, 34.9556],
  denizli: [37.7765, 29.0864],
  diyarbakir: [37.9144, 40.2306],
  duzce: [40.8438, 31.1565],
  edirne: [41.6771, 26.5557],
  elazig: [38.681, 39.2264],
  erzincan: [39.75, 39.5],
  erzurum: [39.9043, 41.2679],
  eskisehir: [39.7767, 30.5206],
  gaziantep: [37.0662, 37.3833],
  giresun: [40.9128, 38.3895],
  gumushane: [40.4603, 39.4814],
  hakkari: [37.5744, 43.7408],
  hatay: [36.2021, 36.1603],
  igdir: [39.9201, 44.0436],
  isparta: [37.7648, 30.5566],
  istanbul: [41.0082, 28.9784],
  izmir: [38.4237, 27.1428],
  kahramanmaras: [37.5753, 36.9228],
  karabuk: [41.2061, 32.6204],
  karaman: [37.1811, 33.215],
  kars: [40.6013, 43.0975],
  kastamonu: [41.3887, 33.7827],
  kayseri: [38.7312, 35.4787],
  kirikkale: [39.8468, 33.5153],
  kirklareli: [41.7333, 27.2167],
  kirsehir: [39.1425, 34.1709],
  kilis: [36.7184, 37.1212],
  kocaeli: [40.8533, 29.8815],
  konya: [37.8746, 32.4932],
  kutahya: [39.4167, 29.9833],
  malatya: [38.3552, 38.3095],
  manisa: [38.6191, 27.4289],
  mardin: [37.3129, 40.7339],
  mersin: [36.8121, 34.6415],
  mugla: [37.2153, 28.3636],
  mus: [38.9462, 41.7539],
  nevsehir: [38.6244, 34.7239],
  nigde: [37.9667, 34.6833],
  ordu: [40.9839, 37.8764],
  osmaniye: [37.0742, 36.2478],
  rize: [41.0201, 40.5234],
  sakarya: [40.7731, 30.3948],
  samsun: [41.2867, 36.33],
  sanliurfa: [37.1674, 38.7955],
  siirt: [37.9333, 41.95],
  sinop: [42.0231, 35.1531],
  sivas: [39.7477, 37.0179],
  sirnak: [37.5164, 42.4611],
  tekirdag: [40.978, 27.511],
  tokat: [40.3167, 36.55],
  trabzon: [41.0015, 39.7178],
  tunceli: [39.1079, 39.5401],
  usak: [38.6823, 29.4082],
  van: [38.4891, 43.4089],
  yalova: [40.65, 29.2667],
  yozgat: [39.8181, 34.8147],
  zonguldak: [41.4564, 31.7987],
};

export function normalizeLocationKey(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTurkeyCityCenter(...values: Array<string | null | undefined>): Coordinates | null {
  for (const value of values) {
    const key = normalizeLocationKey(value);
    if (key && CITY_CENTERS[key]) {
      return CITY_CENTERS[key];
    }
  }

  return null;
}
