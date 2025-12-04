"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Search, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-pink-50 px-4">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
          <Image src="/Logo.svg" alt="Wisudahub" width={150} height={40} />

        {/* Illustration */}
        <div className="relative mx-auto mb-8 h-64 w-64">
          {/* 404 Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[120px] font-bold text-gray-100">404</span>
          </div>
          {/* Graduation Cap Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="text-8xl">🎓</div>
              <div className="absolute -right-2 -top-2 text-3xl">❓</div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mb-8 text-gray-600">
          Oops! Sepertinya halaman yang kamu cari sudah wisuda duluan dan tidak
          ada di sini. Jangan khawatir, mari kembali ke jalan yang benar! 🎉
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full gap-2 bg-[#C0287F] hover:bg-[#a02169] sm:w-auto">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <Search className="h-4 w-4" />
              Jelajahi Layanan
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-gray-700">
            Mungkin kamu mencari:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Fotografer Wisuda", href: "/marketplace?category=fotografer" },
              { label: "Makeup Artist", href: "/marketplace?category=mua" },
              { label: "Bunga & Gift", href: "/marketplace?category=bunga" },
              { label: "Semua Layanan", href: "/marketplace" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 transition-all hover:border-[#C0287F] hover:bg-pink-50 hover:text-[#C0287F]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Help */}
        <p className="mt-8 text-sm text-gray-500">
          Butuh bantuan?{" "}
          <a
            href="mailto:support@wisudahub.com"
            className="font-medium text-[#C0287F] hover:underline"
          >
            Hubungi kami
          </a>
        </p>
      </div>
    </main>
  );
}
