import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WisudaHub - Platform Layanan Wisuda Terlengkap",
  description:
    "Temukan fotografer, makeup artist, dan vendor terbaik untuk momen wisuda spesialmu di ITB dan sekitarnya.",
  icons: {
    icon: "/Logo.svg",
    shortcut: "/favicon.ico",
  },
  keywords: [
    "wisuda",
    "fotografer wisuda",
    "makeup artist",
    "ITB",
    "graduation",
    "photo",
  ],
  authors: [{ name: "WisudaHub" }],
  openGraph: {
    title: "WisudaHub - Platform Layanan Wisuda Terlengkap",
    description:
      "Temukan fotografer, makeup artist, dan vendor terbaik untuk momen wisuda spesialmu.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
