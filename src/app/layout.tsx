// Путь к файлу: src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

// ИСПРАВЛЕНИЕ: Импортируем стили MapLibre здесь, чтобы они гарантированно
// применялись ко всему приложению.
import 'maplibre-gl/dist/maplibre-gl.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GlobusAI - Найди свое следующее направление",
  description: "Интерактивная карта мира, помогающая digital-номадам и путешественникам найти идеальную страну.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}