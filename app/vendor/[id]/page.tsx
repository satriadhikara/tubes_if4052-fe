"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Heart,
  Share2,
  CheckCircle,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
  Award,
  Users,
  Camera,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============ MOCK DATA ============
const mockVendorProfile = {
  id: "v1",
  displayName: "Bandung Photo Studio",
  bio: "Studio foto profesional di Bandung sejak 2019. Spesialisasi foto wisuda, prewedding, dan portrait. Sudah melayani 500+ klien dengan hasil yang memuaskan. Tim kami terdiri dari fotografer berpengalaman yang siap mengabadikan momen spesial Anda dengan sentuhan artistik dan profesional.",
  avatar: "/young-indonesian-man-portrait.jpg",
  coverImage: "/Fotografer-wisuda.png",
  location: "Bandung, Jawa Barat",
  joinedDate: "Januari 2019",
  rating: 4.9,
  reviewCount: 128,
  totalBookings: 342,
  responseRate: 98,
  responseTime: "< 1 jam",
  isVerified: true,
  instagram: "@bandungphotostudio",
  phone: "+62 812-3456-7890",
  email: "bandungphoto@email.com",
  specializations: ["Foto Wisuda", "Prewedding", "Portrait", "Family"],
  achievements: [
    { icon: Award, label: "Top Vendor 2024", color: "text-yellow-500" },
    { icon: Users, label: "500+ Klien", color: "text-blue-500" },
    { icon: ThumbsUp, label: "98% Puas", color: "text-green-500" },
  ],
};

const mockVendorServices = [
  {
    id: "s1",
    title: "Paket Foto Wisuda Premium ITB",
    description:
      "3 jam pemotretan, 60 foto edit, area kampus ITB dan sekitarnya.",
    price: 850000,
    imageUrl: "/Fotografer-wisuda.png",
    durationMinutes: 180,
    rating: 4.9,
    reviewCount: 45,
    totalBookings: 128,
    isFeatured: true,
    category: "Fotografer",
  },
  {
    id: "s2",
    title: "Paket Foto Candid Wisuda",
    description: "2 jam foto candid moment wisuda. 40 foto edit.",
    price: 450000,
    imageUrl: "/Fotografer-wisuda.png",
    durationMinutes: 120,
    rating: 4.6,
    reviewCount: 32,
    totalBookings: 72,
    isFeatured: false,
    category: "Fotografer",
  },
  {
    id: "s3",
    title: "Paket Foto Keluarga Wisuda",
    description: "4 jam, unlimited foto, 100 foto edit untuk keluarga besar.",
    price: 1200000,
    imageUrl: "/Fotografer-wisuda.png",
    durationMinutes: 240,
    rating: 4.8,
    reviewCount: 28,
    totalBookings: 67,
    isFeatured: true,
    category: "Fotografer",
  },
  {
    id: "s4",
    title: "Foto Wisuda Express",
    description: "1 jam pemotretan cepat, 20 foto edit.",
    price: 300000,
    imageUrl: "/Fotografer-wisuda.png",
    durationMinutes: 60,
    rating: 4.5,
    reviewCount: 18,
    totalBookings: 45,
    isFeatured: false,
    category: "Fotografer",
  },
];

const mockVendorReviews = [
  {
    id: "r1",
    customerName: "Sarah Putri",
    customerAvatar: "/young-indonesian-woman-portrait.png",
    rating: 5,
    comment:
      "Fotografernya sangat profesional dan ramah! Hasil fotonya bagus banget, sesuai ekspektasi. Recommended banget untuk foto wisuda!",
    serviceName: "Paket Foto Wisuda Premium ITB",
    date: "2024-11-20",
    images: ["/Fotografer-wisuda.png", "/Fotografer-wisuda.png"],
    helpful: 12,
  },
  {
    id: "r2",
    customerName: "Ahmad Rizki",
    customerAvatar: "/young-indonesian-man-portrait.jpg",
    rating: 5,
    comment:
      "Mantap! Proses booking mudah, vendor responsif, dan hasil foto memuaskan. Keluarga juga senang dengan hasilnya.",
    serviceName: "Paket Foto Keluarga Wisuda",
    date: "2024-11-15",
    images: [],
    helpful: 8,
  },
  {
    id: "r3",
    customerName: "Dewi Lestari",
    customerAvatar: "/young-indonesian-woman-portrait.png",
    rating: 4,
    comment:
      "Overall bagus, foto candid-nya natural banget. Cuma agak lama nunggu hasil editnya, tapi hasilnya worth it!",
    serviceName: "Paket Foto Candid Wisuda",
    date: "2024-11-10",
    images: ["/Fotografer-wisuda.png"],
    helpful: 5,
  },
  {
    id: "r4",
    customerName: "Budi Santoso",
    customerAvatar: "/young-indonesian-man-smiling-portrait.jpg",
    rating: 5,
    comment:
      "Pelayanan terbaik! Fotografer datang tepat waktu dan sangat sabar mengarahkan pose. Hasil fotonya premium banget.",
    serviceName: "Paket Foto Wisuda Premium ITB",
    date: "2024-10-28",
    images: [],
    helpful: 15,
  },
];

const mockPortfolio = [
  "/Fotografer-wisuda.png",
  "/Fotografer-wisuda.png",
  "/Fotografer-wisuda.png",
  "/Fotografer-wisuda.png",
  "/Fotografer-wisuda.png",
  "/Fotografer-wisuda.png",
];

// ============ HELPER FUNCTIONS ============
function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  return `${hours} jam`;
}

// ============ COMPONENTS ============
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/marketplace"
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <Link href="/">
            <Image src="/Logo.svg" alt="Wisudahub" width={120} height={32} />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function VendorHero() {
  const vendor = mockVendorProfile;

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64">
        <Image
          src={vendor.coverImage}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative -mt-16 flex flex-col items-center md:-mt-20 md:flex-row md:items-end md:gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg md:h-40 md:w-40">
              <AvatarImage src={vendor.avatar} />
              <AvatarFallback className="text-4xl">
                {vendor.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {vendor.isVerified && (
              <div className="absolute bottom-2 right-2 rounded-full bg-blue-500 p-1.5">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-4 flex-1 text-center md:mb-4 md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {vendor.displayName}
              </h1>
              {vendor.isVerified && (
                <Badge className="bg-blue-100 text-blue-700">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Terverifikasi
                </Badge>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 md:justify-start">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">
                  {vendor.rating}
                </span>
                <span>({vendor.reviewCount} ulasan)</span>
              </div>
              <span className="hidden text-gray-300 md:inline">|</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {vendor.location}
              </div>
              <span className="hidden text-gray-300 md:inline">|</span>
              <span>Bergabung {vendor.joinedDate}</span>
            </div>

            {/* Specializations */}
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              {vendor.specializations.map((spec) => (
                <Badge key={spec} variant="outline" className="bg-white">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden gap-2 md:mb-4 md:flex">
            <Button className="gap-2 bg-[#C0287F] hover:bg-[#a02169]">
              <MessageCircle className="h-4 w-4" />
              Chat Vendor
            </Button>
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              Hubungi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VendorStats() {
  const vendor = mockVendorProfile;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-[#C0287F]">
            {vendor.totalBookings}
          </p>
          <p className="text-sm text-gray-500">Total Booking</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-[#0057AB]">{vendor.rating}</p>
          <p className="text-sm text-gray-500">Rating</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {vendor.responseRate}%
          </p>
          <p className="text-sm text-gray-500">Response Rate</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-[#EFA90D]">
            {vendor.responseTime}
          </p>
          <p className="text-sm text-gray-500">Response Time</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {vendor.achievements.map((achievement, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"
          >
            <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
            <span className="text-sm font-medium text-gray-700">
              {achievement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VendorAbout() {
  const vendor = mockVendorProfile;

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Tentang Vendor
        </h2>
        <p className="whitespace-pre-line text-gray-600">{vendor.bio}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <a
            href={`https://instagram.com/${vendor.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border p-3 transition-all hover:border-pink-300 hover:bg-pink-50"
          >
            <Instagram className="h-5 w-5 text-pink-500" />
            <div>
              <p className="text-sm text-gray-500">Instagram</p>
              <p className="font-medium text-gray-900">{vendor.instagram}</p>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
          </a>
          <a
            href={`tel:${vendor.phone}`}
            className="flex items-center gap-3 rounded-xl border p-3 transition-all hover:border-blue-300 hover:bg-blue-50"
          >
            <Phone className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Telepon</p>
              <p className="font-medium text-gray-900">{vendor.phone}</p>
            </div>
          </a>
          <a
            href={`mailto:${vendor.email}`}
            className="flex items-center gap-3 rounded-xl border p-3 transition-all hover:border-green-300 hover:bg-green-50"
          >
            <Mail className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{vendor.email}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

function VendorServices() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Layanan ({mockVendorServices.length})
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockVendorServices.map((service) => (
          <Link
            key={service.id}
            href={`/service/${service.id}`}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-40">
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {service.isFeatured && (
                <Badge className="absolute left-3 top-3 bg-[#EFA90D] text-black">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#C0287F]">
                {service.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {service.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-gray-400">({service.reviewCount})</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  {formatDuration(service.durationMinutes)}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <p className="text-lg font-bold text-[#C0287F]">
                  {formatPrice(service.price)}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="group-hover:bg-[#C0287F] group-hover:text-white"
                >
                  Lihat Detail
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function VendorPortfolio() {
  const [showAll, setShowAll] = useState(false);
  const displayedImages = showAll ? mockPortfolio : mockPortfolio.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Portfolio</h2>
        <Button variant="ghost" size="sm" className="text-[#C0287F]">
          <Camera className="mr-2 h-4 w-4" />
          Lihat Semua
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {displayedImages.map((image, i) => (
          <div
            key={i}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
          >
            <Image
              src={image}
              alt={`Portfolio ${i + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/30" />
          </div>
        ))}
      </div>
    </div>
  );
}

function VendorReviews() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Ulasan ({mockVendorReviews.length})
        </h2>
        <div className="flex gap-2">
          {["all", "5", "4", "3"].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                filter === r
                  ? "bg-[#C0287F] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r === "all" ? "Semua" : `⭐ ${r}`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {mockVendorReviews.map((review) => (
          <div key={review.id} className="rounded-2xl border bg-white p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.customerAvatar} />
                <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.customerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {review.serviceName}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {formatDate(review.date)}
                  </p>
                </div>

                {/* Rating */}
                <div className="mt-2 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="mt-2 text-gray-600">{review.comment}</p>

                {/* Images */}
                {review.images.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {review.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative h-20 w-20 overflow-hidden rounded-lg"
                      >
                        <Image
                          src={img}
                          alt={`Review image ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful */}
                <div className="mt-3 flex items-center gap-2">
                  <button className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Button variant="outline" className="gap-2">
          Lihat Semua Ulasan
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MobileActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg md:hidden">
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2">
          <Phone className="h-4 w-4" />
          Hubungi
        </Button>
        <Button className="flex-1 gap-2 bg-[#C0287F] hover:bg-[#a02169]">
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </div>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function VendorProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <Header />
      <VendorHero />
      <VendorStats />
      <VendorAbout />
      <VendorServices />
      <VendorPortfolio />
      <VendorReviews />
      <MobileActionBar />
    </main>
  );
}
