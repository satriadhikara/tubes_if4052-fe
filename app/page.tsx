"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Star,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const services = [
  { title: "Fotografer Wisuda", image: "/Fotografer-wisuda.png" },
  { title: "MUA", image: "/MUA.png" },
  { title: "Bunga", image: "/Bunga.png" },
  { title: "Hadiah", image: "/Hadiah.jpg" },
];

const testimonials = [
  {
    id: 1,
    name: "Muhammad Aland Panji",
    title: "Alumni WKWK ITB 2024",
    avatar: "/young-indonesian-man-portrait.jpg",
    content:
      "Jyujyur belum pernah nemu fotografer se-effort inih. Guys wajib banget pake wisuda hub buat merayakan wisuda kalian!",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Putri",
    title: "Alumni UI 2024",
    avatar: "/young-indonesian-woman-portrait.png",
    content:
      "MUA nya super profesional dan hasilnya cantik banget! Recommended banget untuk wisuda!",
    rating: 5,
  },
  {
    id: 3,
    name: "Budi Santoso",
    title: "Alumni UGM 2024",
    avatar: "/young-indonesian-man-smiling-portrait.jpg",
    content:
      "Bunga dan hadiahnya bagus-bagus, pengirimannya juga tepat waktu. Terima kasih Wisudahub!",
    rating: 5,
  },
];

// ============ ICONS ============
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function Header() {
  return (
    <header className="bg-[#0057AB] px-4 py-3">
      <div className="flex w-full items-center justify-between gap-4 px-4">
        <div className="flex items-center ml-10 mb-3">
          <Image src="/Logo.svg" alt="Wisudahub" width={150} height={40} />
        </div>
        <div className="flex gap-3">
          <Button className="rounded-md bg-[#C0287F] px-4 py-2 text-sm font-medium text-white hover:bg-blue-400">
            <User className="mr-2 h-4 w-4" />
            Masuk
          </Button>
          <Button className="rounded-md bg-[#C0287F] px-4 py-2 text-sm font-medium text-white hover:bg-blue-400">
            <User className="mr-2 h-4 w-4" />
            Daftar
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[650px] items-center px-4 py-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url('/Background-landing.jpg')`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(270deg, #FFD93D33, #004383)",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          Rayakan wisudamu,
        </h1>
        <h2 className="mb-4 text-3xl font-bold text-yellow-400 md:text-4xl lg:text-5xl">
          gapake ribet.
        </h2>
        <p className="mb-8 text-lg text-white/90">Di sini kamu bisa cari...</p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button className="rounded-md bg-[#EFA90D] px-5 py-2 !text-black hover:bg-blue-400">
            📷  Fotografer
          </Button>
          <Button className="rounded-md bg-[#C0287F] px-5 py-2 text-white hover:bg-yellow-400">
            🌻  Hadiah/Bunga
          </Button>
          <Button className="rounded-md bg-white px-5 py-2 !text-black hover:bg-yellow-400">
            💄  MUA
          </Button>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-blue-600 md:text-3xl">
          Merayakan wisuda tidak pernah semudah ini!
        </h2>
        <p className="mb-10 text-center text-gray-600">
          Berikut ini layanan terbaik yang kami sediakan
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative h-64 overflow-hidden rounded-2xl md:h-80"
            >
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#FFD93D]/90 via-[#FFD93D]/50 to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <h3 className="text-lg font-bold text-white">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative flex min-h-[650px] items-center justify-center px-4 py-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/Background-landing-2.jpg')`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/30 to-transparent pointer-events-none" />

      {/* Hapus 'mx-auto' karena sudah di-handle oleh flex parent, tapi 'relative' dan 'w-full' tetap perlu */}
      <div className="relative w-full max-w-7xl">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-2xl shadow-blue-900/20 border border-gray-100">
          <h3 className="mb-4 text-center text-xl font-bold text-yellow-500">
            Review jujur dari klien kami
          </h3>

          <div className="mb-4 flex justify-center gap-1">
            {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          <p className="mb-6 text-center text-sm text-gray-600">
            {testimonials[activeIndex].content}
          </p>

          <div className="flex flex-col items-center">
            <Avatar className="mb-2 h-12 w-12">
              <AvatarImage
                src={testimonials[activeIndex].avatar || "/placeholder.svg"}
              />
              <AvatarFallback>
                {testimonials[activeIndex].name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-gray-800">
              {testimonials[activeIndex].name}
            </p>
            <p className="text-xs text-gray-500">
              {testimonials[activeIndex].title}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-gray-800" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-blue-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center">
          <Image src="/Logo.svg" alt="Wisudahub" width={150} height={40} />
        </div>

        <div className="mb-6 h-px bg-blue-700" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-300">
            @2025 Wisuda hub. All rights reserved
          </p>

          <div className="flex gap-4">
            <a
              href="#"
              className="text-white transition-colors hover:text-yellow-400"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-white transition-colors hover:text-yellow-400"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN PAGE ============
export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <TestimonialSection />
      <Footer />
    </main>
  );
}
