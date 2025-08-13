// Путь к файлу: tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ДОБАВЛЯЕМ НАШУ ПАЛИТРУ ЦВЕТОВ
      colors: {
        brand: {
          surface: '#1A1D2A',   // Основной темный фон
          dark: '#252A3D',      // Фон для карточек, чуть светлее
          primary: '#4A5568',   // Цвет для границ
          highlight: '#AFFF5C', // Яркий акцентный цвет для текста и линий
        },
      },
      // Добавляем анимации, необходимые для shadcn/ui
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // ДОБАВЛЯЕМ ПЛАГИН ДЛЯ АНИМАЦИИ
  plugins: [require("tailwindcss-animate")],
};

export default config;