"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
  Loader2,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/loading";
import { ErrorDisplay } from "@/components/ui/error";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { servicesApi, testimonialsApi, bookingsApi } from "@/lib/api";
import type { Service, Testimonial } from "@/lib/api/types";

// ============ TYPES ============
interface ServiceDisplay {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrls: string[];
  durationMinutes: number | null;
  isFeatured: boolean;
  location: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  vendorBio: string;
  vendorPhone: string;
  vendorLocation: string;
  vendorJoinedDate: string;
  vendorTotalServices: number;
  vendorTotalBookings: number;
  categoryName: string;
  rating: number;
  reviewCount: number;
}

interface ReviewDisplay {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
}

interface RelatedServiceDisplay {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  vendorName: string;
  rating: number;
  reviewCount: number;
}

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
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#0057AB] px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Link href="/">
            <Image src="/Logo.svg" alt="Wisudahub" width={130} height={36} />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link
                href={
                  user.role === "vendor"
                    ? "/vendor/dashboard"
                    : "/customer/dashboard"
                }
              >
                <Button
                  variant="ghost"
                  className="hidden text-white hover:bg-white/10 md:flex"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={async () => {
                  await logout();
                  router.push("/auth?redirect=/marketplace");
                }}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button className="rounded-full bg-[#C0287F] px-4 py-2 text-sm font-medium text-white hover:bg-[#a02169]">
                <User className="mr-2 h-4 w-4" />
                Masuk
              </Button>
            </Link>
          )}
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

function ServiceInfo({ service }: { service: ServiceDisplay }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const toast = useToast();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: service.title,
        text: service.description.substring(0, 100),
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin!");
    }
  };

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
            <Button variant="outline" size="icon" onClick={handleShare}>
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

function BookingCard({ service }: { service: ServiceDisplay }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.warning("Silakan login terlebih dahulu untuk melakukan booking");
      router.push(`/auth?redirect=/service/${service.id}`);
      return;
    }

    if (!selectedDate) {
      toast.error("Silakan pilih tanggal acara terlebih dahulu");
      return;
    }

    setIsLoading(true);
    try {
      // Create booking via API
      const booking = await bookingsApi.create({
        serviceId: service.id,
        eventDate: new Date(selectedDate).toISOString(),
        location: service.location,
        notes: notes || undefined,
      });

      toast.success("Booking berhasil dibuat!");
      // Redirect to booking detail / checkout page
      router.push(`/checkout/${booking.id}`);
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Gagal membuat booking. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = () => {
    if (!isAuthenticated) {
      toast.warning("Silakan login terlebih dahulu");
      router.push(`/auth?redirect=/service/${service.id}`);
      return;
    }
    toast.info("Fitur chat akan segera hadir");
  };

  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

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
            min={minDate}
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
        <Button
          className="w-full bg-[#0057AB] py-6 text-lg font-semibold hover:bg-[#004080]"
          onClick={handleBooking}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            "Pesan Sekarang"
          )}
        </Button>

        <Button variant="outline" className="w-full gap-2" onClick={handleChat}>
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

function VendorCard({ service }: { service: ServiceDisplay }) {
  const router = useRouter();

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
        <Link href={`/vendor/${service.vendorId}`} className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            Lihat Profil
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ReviewsSection({
  reviews,
  isLoading,
}: {
  reviews: ReviewDisplay[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b pb-6 last:border-0">
              <div className="mb-3 flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Ulasan</h3>
        <p className="text-center text-gray-500 py-8">
          Belum ada ulasan untuk layanan ini
        </p>
      </div>
    );
  }

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

function RelatedServices({
  services,
  isLoading,
}: {
  services: RelatedServiceDisplay[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 rounded-xl border p-3">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Layanan Serupa</h3>

      <div className="space-y-4">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/service/${service.id}`}
            className="flex gap-4 rounded-xl border p-3 transition-all hover:border-blue-200 hover:bg-blue-50/50"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={service.imageUrl || "/placeholder.svg"}
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
          </Link>
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

// ============ LOADING SKELETON ============
function ServiceDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Service Info Skeleton */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>

          {/* Vendor Card Skeleton */}
          <div className="rounded-2xl border p-6">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="rounded-2xl border p-6 space-y-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  // State
  const [service, setService] = useState<ServiceDisplay | null>(null);
  const [reviews, setReviews] = useState<ReviewDisplay[]>([]);
  const [relatedServicesList, setRelatedServicesList] = useState<
    RelatedServiceDisplay[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map API service to display format
  const mapServiceToDisplay = (apiService: Service): ServiceDisplay => ({
    id: apiService.id,
    title: apiService.title,
    description: apiService.description,
    price: apiService.price,
    imageUrls: apiService.imageUrls?.length
      ? apiService.imageUrls
      : ["/placeholder.svg"],
    durationMinutes: apiService.durationMinutes || null,
    isFeatured: apiService.isFeatured || false,
    location: apiService.vendor?.location || apiService.location || "Bandung",
    vendorId: apiService.vendor?.id || apiService.vendorId || "",
    vendorName: apiService.vendor?.displayName || "Vendor",
    vendorAvatar: apiService.vendor?.avatarUrl || "/placeholder.svg",
    vendorBio: apiService.vendor?.bio || "",
    vendorPhone: "-", // Not in Vendor type, would need User
    vendorLocation: apiService.vendor?.location || "-",
    vendorJoinedDate: apiService.vendor?.createdAt
      ? new Date(apiService.vendor.createdAt).getFullYear().toString()
      : "2024",
    vendorTotalServices: 0, // Would need separate API call
    vendorTotalBookings: apiService.vendor?.totalBookings || 0,
    categoryName: apiService.category?.name || "Layanan",
    rating: apiService.rating || 0,
    reviewCount: apiService.reviewCount || 0,
  });

  // Map API testimonial to display format
  const mapTestimonialToDisplay = (
    testimonial: Testimonial
  ): ReviewDisplay => ({
    id: testimonial.id,
    userName: testimonial.customer?.name || "Anonymous",
    userAvatar: testimonial.customer?.avatarUrl || "/placeholder.svg",
    rating: testimonial.rating,
    comment: testimonial.comment,
    date: testimonial.createdAt,
    serviceName: testimonial.service?.title || "",
  });

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      try {
        setIsLoading(true);
        setError(null);

        const data = await servicesApi.getById(serviceId);

        if (data) {
          setService(mapServiceToDisplay(data));
        } else {
          setError("Layanan tidak ditemukan");
        }
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setError("Gagal memuat layanan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!serviceId) return;

      try {
        setIsLoadingReviews(true);

        const data = await testimonialsApi.getByService(serviceId);

        if (data && Array.isArray(data)) {
          setReviews(data.map(mapTestimonialToDisplay));
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  // Fetch related services
  useEffect(() => {
    const fetchRelatedServices = async () => {
      if (!service?.categoryName) return;

      try {
        setIsLoadingRelated(true);

        const data = await servicesApi.getAll({
          limit: 4,
          // Would ideally filter by category
        });

        if (data && Array.isArray(data)) {
          const related = data
            .filter((s: Service) => s.id !== serviceId)
            .slice(0, 3)
            .map((s: Service) => ({
              id: s.id,
              title: s.title,
              price: s.price,
              imageUrl: s.imageUrls?.[0] || "/placeholder.svg",
              vendorName: s.vendor?.displayName || "Vendor",
              rating: s.rating || 0,
              reviewCount: s.reviewCount || 0,
            }));
          setRelatedServicesList(related);
        } else {
          setRelatedServicesList([]);
        }
      } catch (err) {
        console.error("Failed to fetch related services:", err);
        setRelatedServicesList([]);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    fetchRelatedServices();
  }, [service?.categoryName, serviceId]);

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <ServiceDetailSkeleton />
        <Footer />
      </main>
    );
  }

  // Show error state
  if (error && !service) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-16">
          <ErrorDisplay
            title="Layanan Tidak Ditemukan"
            message={error}
            onRetry={() => window.location.reload()}
            showHomeButton
            showBackButton
          />
        </div>
        <Footer />
      </main>
    );
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-16">
          <ErrorDisplay
            title="Layanan Tidak Ditemukan"
            message="Layanan yang Anda cari tidak tersedia"
            showHomeButton
            showBackButton
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <ImageGallery images={service.imageUrls} />
            <ServiceInfo service={service} />
            <VendorCard service={service} />
            <ReviewsSection reviews={reviews} isLoading={isLoadingReviews} />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard service={service} />
            <div className="mt-6">
              <RelatedServices
                services={relatedServicesList}
                isLoading={isLoadingRelated}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
