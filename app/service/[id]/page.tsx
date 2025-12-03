"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Star,
  Instagram,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Calendar,
  MessageCircle,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============ MOCK DATA ============
const mockService = {
  id: "1",
  title: "Paket Foto Wisuda Premium ITB",
  description: `Paket foto wisuda premium dengan hasil profesional untuk momen spesial kelulusanmu!

📸 **Yang Kamu Dapat:**
- 3 jam sesi pemotretan
- 60 foto sudah diedit (soft copy high resolution)
- 1 Album foto cetak 20x30 cm (10 halaman)
- Free 5 foto cetak 4R
- Outfit change maksimal 3x
- Area pemotretan: Kampus ITB, Dago, Taman Hutan Raya

💡 **Keunggulan:**
- Fotografer berpengalaman 5+ tahun
- Peralatan profesional (Sony A7III + lighting kit)
- Hasil foto dikirim H+5 via Google Drive
- Revisi minor 2x gratis
- Bisa request pose/konsep foto

⏰ **Jadwal Tersedia:**
Senin - Minggu, 06:00 - 18:00 WIB
(Booking minimal H-3)`,
  price: 850000,
  imageUrls: [
    "/Fotografer-wisuda.png",
    "/Background-landing.jpg",
    "/Background-landing-2.jpg",
  ],
  durationMinutes: 180,
  isFeatured: true,
  location: "Bandung",
  vendorId: "v1",
  vendorName: "Bandung Photo Studio",
  vendorAvatar: "/young-indonesian-man-portrait.jpg",
  vendorBio:
    "Studio foto profesional di Bandung sejak 2019. Spesialisasi foto wisuda, prewedding, dan portrait.",
  vendorPhone: "+62 812-3456-7890",
  vendorLocation: "Jl. Dago No. 123, Bandung",
  vendorJoinedDate: "2019",
  vendorTotalServices: 5,
  vendorTotalBookings: 342,
  categoryName: "Fotografer",
  rating: 4.9,
  reviewCount: 128,
};

const mockReviews = [
  {
    id: "r1",
    userName: "Sarah Putri",
    userAvatar: "/young-indonesian-woman-portrait.png",
    rating: 5,
    comment:
      "Fotografernya super ramah dan profesional! Hasilnya bagus banget, keluarga puas semua. Recommended banget!",
    date: "2024-10-15",
    serviceName: "Paket Foto Wisuda Premium ITB",
  },
  {
    id: "r2",
    userName: "Ahmad Rizki",
    userAvatar: "/young-indonesian-man-portrait.jpg",
    rating: 5,
    comment:
      "Worth it banget sama harganya. Foto dikirim cepet, editannya juga natural gak lebay. Pasti bakal pake lagi!",
    date: "2024-10-12",
    serviceName: "Paket Foto Wisuda Premium ITB",
  },
  {
    id: "r3",
    userName: "Dewi Lestari",
    userAvatar: "/young-indonesian-woman-portrait.png",
    rating: 4,
    comment:
      "Overall bagus, cuma agak telat datengnya. Tapi hasil fotonya tetep oke dan komunikasinya lancar.",
    date: "2024-10-08",
    serviceName: "Paket Foto Wisuda Premium ITB",
  },
];

const relatedServices = [
  {
    id: "2",
    title: "Paket Foto Candid Wisuda",
    price: 450000,
    imageUrl: "/Fotografer-wisuda.png",
    vendorName: "Moment Capture",
    rating: 4.6,
    reviewCount: 72,
  },
  {
    id: "7",
    title: "Paket Foto Keluarga Wisuda",
    price: 1200000,
    imageUrl: "/Fotografer-wisuda.png",
    vendorName: "Family Shots",
    rating: 4.8,
    reviewCount: 67,
  },
  {
    id: "4",
    title: "Foto Wisuda Express",
    price: 350000,
    imageUrl: "/Fotografer-wisuda.png",
    vendorName: "Quick Snap BDG",
    rating: 4.5,
    reviewCount: 45,
  },
];

// ============ HELPER FUNCTIONS ============
function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDuration(minutes: number | null) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

// ============ COMPONENTS ============
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0057AB] px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Image src="/Logo.svg" alt="Wisudahub" width={130} height={36} />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hidden text-white hover:bg-white/10 md:flex"
          >
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Button>
          <Button className="rounded-full bg-[#C0287F] px-4 py-2 text-sm font-medium text-white hover:bg-[#a02169]">
            <User className="mr-2 h-4 w-4" />
            Masuk
          </Button>
        </div>
      </div>
    </header>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={images[activeIndex] || "/placeholder.svg"}
          alt="Service image"
          fill
          className="object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                index === activeIndex
                  ? "ring-2 ring-[#0057AB] ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceInfo({ service }: { service: typeof mockService }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge className="bg-blue-50 text-[#0057AB]">
            {service.categoryName}
          </Badge>
          {service.isFeatured && (
            <Badge className="bg-[#EFA90D] text-black">⭐ Featured</Badge>
          )}
        </div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
          {service.title}
        </h1>

        {/* Rating & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{service.rating}</span>
              <span className="text-gray-500">
                ({service.reviewCount} ulasan)
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-4 w-4" />
              {service.location}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Duration */}
      {service.durationMinutes && (
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-5 w-5" />
          <span>Durasi: {formatDuration(service.durationMinutes)}</span>
        </div>
      )}

      {/* Description */}
      <div className="rounded-xl bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-900">Deskripsi Layanan</h3>
        <div className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {service.description}
        </div>
      </div>

      {/* Guarantees */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="h-5 w-5 text-green-500" />
          <span>Pembayaran Aman</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Vendor Terverifikasi</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageCircle className="h-5 w-5 text-green-500" />
          <span>Respon Cepat</span>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ service }: { service: typeof mockService }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      {/* Price */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">Harga</p>
        <p className="text-3xl font-bold text-[#C0287F]">
          {formatPrice(service.price)}
        </p>
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <Calendar className="mr-2 inline h-4 w-4" />
            Tanggal Acara
          </label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <MessageCircle className="mr-2 inline h-4 w-4" />
            Catatan (opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Mau foto di depan Aula Barat jam 8 pagi..."
            className="h-24 w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Harga layanan</span>
            <span className="font-medium">{formatPrice(service.price)}</span>
          </div>
          <div className="my-2 h-px bg-gray-200" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold text-[#C0287F]">
              {formatPrice(service.price)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <Button className="w-full bg-[#0057AB] py-6 text-lg font-semibold hover:bg-[#004080]">
          Pesan Sekarang
        </Button>

        <Button variant="outline" className="w-full gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat Vendor
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <Shield className="h-4 w-4" />
        <span>Transaksi dijamin aman</span>
      </div>
    </div>
  );
}

function VendorCard({ service }: { service: typeof mockService }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Tentang Vendor</h3>

      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={service.vendorAvatar} />
          <AvatarFallback className="text-xl">
            {service.vendorName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{service.vendorName}</h4>
          <p className="mb-2 text-sm text-gray-500">
            Bergabung sejak {service.vendorJoinedDate}
          </p>

          <div className="mb-3 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{service.rating}</span>
            </div>
            <div className="text-gray-500">
              {service.vendorTotalServices} Layanan
            </div>
            <div className="text-gray-500">
              {service.vendorTotalBookings} Booking
            </div>
          </div>

          <p className="mb-4 text-sm text-gray-600">{service.vendorBio}</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              {service.vendorLocation}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              {service.vendorPhone}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1 gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          Lihat Profil
        </Button>
      </div>
    </div>
  );
}

function ReviewsSection({ reviews }: { reviews: typeof mockReviews }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Ulasan ({reviews.length})
        </h3>
        <Button variant="outline" size="sm">
          Lihat Semua
        </Button>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="mb-3 flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.userAvatar} />
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    {review.userName}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.date)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedServices({ services }: { services: typeof relatedServices }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Layanan Serupa</h3>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex gap-4 rounded-xl border p-3 transition-all hover:border-blue-200 hover:bg-blue-50/50"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="line-clamp-1 font-medium text-gray-900">
                {service.title}
              </h4>
              <p className="text-sm text-gray-500">{service.vendorName}</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{service.rating}</span>
                </div>
                <span className="font-semibold text-[#C0287F]">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1e3a5f] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center">
          <Image src="/Logo.svg" alt="Wisudahub" width={130} height={36} />
        </div>

        <div className="mb-6 h-px bg-blue-700/50" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-400">
            © 2025 WisudaHub. All rights reserved
          </p>

          <div className="flex gap-4">
            <a
              href="#"
              className="text-white transition-colors hover:text-[#EFA90D]"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-white transition-colors hover:text-[#EFA90D]"
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
export default function ServiceDetailPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <ImageGallery images={mockService.imageUrls} />
            <ServiceInfo service={mockService} />
            <VendorCard service={mockService} />
            <ReviewsSection reviews={mockReviews} />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard service={mockService} />
            <div className="mt-6">
              <RelatedServices services={relatedServices} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
