"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { vendorsApi } from "@/lib/api";
import type { Vendor, Service, Testimonial } from "@/lib/api/types";

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

function VendorHero({ vendor }: { vendor: Vendor }) {
  // Get first service image as cover if no vendor cover
  const coverImage = vendor.avatarUrl || "/Fotografer-wisuda.png";

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64">
        <Image src={coverImage} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative -mt-16 flex flex-col items-center md:-mt-20 md:flex-row md:items-end md:gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg md:h-40 md:w-40">
              <AvatarImage src={vendor.avatarUrl} />
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
                  {vendor.rating.toFixed(1)}
                </span>
                <span>({vendor.reviewCount} ulasan)</span>
              </div>
              {vendor.location && (
                <>
                  <span className="hidden text-gray-300 md:inline">|</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {vendor.location}
                  </div>
                </>
              )}
              <span className="hidden text-gray-300 md:inline">|</span>
              <span>
                Bergabung{" "}
                {new Date(vendor.createdAt).toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
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

function VendorStats({ vendor }: { vendor: Vendor }) {
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
          <p className="text-3xl font-bold text-[#0057AB]">
            {vendor.rating.toFixed(1)}
          </p>
          <p className="text-sm text-gray-500">Rating</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {vendor.reviewCount}
          </p>
          <p className="text-sm text-gray-500">Ulasan</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-[#EFA90D]">
            {vendor.isVerified ? "✓" : "-"}
          </p>
          <p className="text-sm text-gray-500">Terverifikasi</p>
        </div>
      </div>

      {/* Achievements */}
      {vendor.totalBookings > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {vendor.totalBookings >= 100 && (
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Top Vendor
              </span>
            </div>
          )}
          {vendor.totalBookings >= 50 && (
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {vendor.totalBookings}+ Klien
              </span>
            </div>
          )}
          {vendor.rating >= 4.5 && (
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Rating Tinggi
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VendorAbout({ vendor }: { vendor: Vendor }) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Tentang Vendor
        </h2>
        <p className="whitespace-pre-line text-gray-600">
          {vendor.bio || "Belum ada deskripsi."}
        </p>

        {vendor.location && (
          <div className="mt-6">
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <MapPin className="h-5 w-5 text-[#C0287F]" />
              <div>
                <p className="text-sm text-gray-500">Lokasi</p>
                <p className="font-medium text-gray-900">{vendor.location}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VendorServices({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Layanan</h2>
        <div className="rounded-2xl border bg-white p-8 text-center">
          <Camera className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-500">Belum ada layanan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Layanan ({services.length})
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/service/${service.id}`}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-40">
              <Image
                src={service.imageUrls?.[0] || "/Fotografer-wisuda.png"}
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
                  <span className="font-medium">
                    {service.rating.toFixed(1)}
                  </span>
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

function VendorPortfolio({ services }: { services: Service[] }) {
  const [showAll, setShowAll] = useState(false);

  // Collect all images from services
  const allImages = services.flatMap((s) => s.imageUrls || []).slice(0, 12);
  const displayedImages = showAll ? allImages : allImages.slice(0, 6);

  if (displayedImages.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Portfolio</h2>
        {allImages.length > 6 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-[#C0287F]"
            onClick={() => setShowAll(!showAll)}
          >
            <Camera className="mr-2 h-4 w-4" />
            {showAll ? "Tampilkan Sedikit" : "Lihat Semua"}
          </Button>
        )}
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

function VendorReviews({ testimonials }: { testimonials: Testimonial[] }) {
  const [filter, setFilter] = useState("all");

  const filteredReviews =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.rating === parseInt(filter));

  if (testimonials.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Ulasan</h2>
        <div className="rounded-2xl border bg-white p-8 text-center">
          <Star className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-500">Belum ada ulasan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Ulasan ({testimonials.length})
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
        {filteredReviews.map((review) => (
          <div key={review.id} className="rounded-2xl border bg-white p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.customer?.avatarUrl} />
                <AvatarFallback>
                  {review.customer?.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.customer?.name || "Anonim"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {review.service?.title || "Layanan"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {formatDate(review.createdAt)}
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
                {review.imageUrls && review.imageUrls.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {review.imageUrls.map((img, i) => (
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 text-center">
          <p className="text-gray-500">Tidak ada ulasan dengan rating ini</p>
        </div>
      )}
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
  const params = useParams();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await vendorsApi.getById(vendorId);
        setVendor(data.vendor);
        setServices(data.services || []);
        setTestimonials(data.testimonials || []);
      } catch (err) {
        console.error("Failed to fetch vendor:", err);
        setError("Gagal memuat data vendor");
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#C0287F]" />
          <p className="mt-2 text-gray-600">Memuat profil vendor...</p>
        </div>
      </main>
    );
  }

  if (error || !vendor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Vendor Tidak Ditemukan
          </h1>
          <p className="mb-6 text-gray-600">
            {error || "Vendor yang Anda cari tidak dapat ditemukan."}
          </p>
          <Link href="/marketplace">
            <Button className="w-full bg-[#C0287F] hover:bg-[#a02169]">
              Jelajahi Marketplace
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <Header />
      <VendorHero vendor={vendor} />
      <VendorStats vendor={vendor} />
      <VendorAbout vendor={vendor} />
      <VendorServices services={services} />
      <VendorPortfolio services={services} />
      <VendorReviews testimonials={testimonials} />
      <MobileActionBar />
    </main>
  );
}
