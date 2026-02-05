import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Renkleri CSS değişkenlerine bağlıyoruz
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          hover: "rgb(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          sub: "rgb(var(--secondary-sub))",
        },
        borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0', // Varsayılanı keskin yapıyoruz
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '9999px', // Sadece butonlar veya avatarlar için yuvarlak kalsın
      },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
export default config;