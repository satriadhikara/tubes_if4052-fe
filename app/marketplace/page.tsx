"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Star,
  Instagram,
  Search,
  Filter,
  MapPin,
  Clock,
  ChevronDown,
  Heart,
  ShoppingCart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============ MOCK DATA ============
const categories = [
  { id: "all", name: "Semua", slug: "all", icon: "🎓" },
  { id: "1", name: "Fotografer", slug: "fotografer", icon: "📷" },
  { id: "2", name: "Make Up Artist", slug: "mua", icon: "💄" },
  { id: "3", name: "Bunga & Hadiah", slug: "bunga", icon: "🌸" },
];

const mockServices = [
  {
    id: "1",
    title: "Paket Foto Wisuda Premium ITB",
    description:
      "3 jam pemotretan, 60 foto edit, area kampus ITB, Dago, dan sekitarnya. Include soft file & album.",
    price: 850000,
    imageUrls: ["/Fotografer-wisuda.png"],
    durationMinutes: 180,
    isFeatured: true,
    location: "Bandung",
    vendorName: "Bandung Photo Studio",
    vendorAvatar: "/young-indonesian-man-portrait.jpg",
    categoryName: "Fotografer",
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: "2",
    title: "Make Up Wisuda Natural Glam",
    description:
      "Make up natural glam + hair do elegant. Datang ke lokasi area Bandung. Tahan seharian!",
    price: 550000,
    imageUrls: ["/MUA.png"],
    durationMinutes: 90,
    isFeatured: true,
    location: "Bandung",
    vendorName: "Glow Beauty MUA",
    vendorAvatar: "/young-indonesian-woman-portrait.png",
    categoryName: "Make Up Artist",
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: "3",
    title: "Bouquet Bunga Wisuda Elegant",
    description:
      "Bouquet bunga segar premium dengan wrapping elegant. Bisa request warna dan jenis bunga.",
    price: 350000,
    imageUrls: ["/Bunga.png"],
    durationMinutes: null,
    isFeatured: false,
    location: "Bandung",
    vendorName: "Flora Bandung",
    vendorAvatar: "/young-indonesian-man-smiling-portrait.jpg",
    categoryName: "Bunga & Hadiah",
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: "4",
    title: "Paket Foto Candid Wisuda",
    description:
      "2 jam foto candid moment wisuda. 40 foto edit, kirim H+3. Perfect untuk moment spontan!",
    price: 450000,
    imageUrls: ["/Fotografer-wisuda.png"],
    durationMinutes: 120,
    isFeatured: false,
    location: "Bandung",
    vendorName: "Moment Capture",
    vendorAvatar: "/young-indonesian-man-portrait.jpg",
    categoryName: "Fotografer",
    rating: 4.6,
    reviewCount: 72,
  },
  {
    id: "5",
    title: "Paket MUA + Hijab Do",
    description:
      "Make up flawless + hijab styling modern. Cocok untuk wisudawati berhijab. Include touch up kit.",
    price: 650000,
    imageUrls: ["/MUA.png"],
    durationMinutes: 120,
    isFeatured: true,
    location: "Bandung",
    vendorName: "Hijab Beauty Studio",
    vendorAvatar: "/young-indonesian-woman-portrait.png",
    categoryName: "Make Up Artist",
    rating: 4.9,
    reviewCount: 104,
  },
  {
    id: "6",
    title: "Snack Bucket Wisuda",
    description:
      "Bucket snack premium berisi 15+ snack favorit + bunga mini. Perfect gift untuk sahabat!",
    price: 275000,
    imageUrls: ["/Hadiah.jpg"],
    durationMinutes: null,
    isFeatured: false,
    location: "Bandung",
    vendorName: "Gift Corner ITB",
    vendorAvatar: "/young-indonesian-man-smiling-portrait.jpg",
    categoryName: "Bunga & Hadiah",
    rating: 4.5,
    reviewCount: 43,
  },
  {
    id: "7",
    title: "Paket Foto Keluarga Wisuda",
    description:
      "Paket foto wisuda bersama keluarga besar. 4 jam, unlimited foto, 100 foto edit. Area ITB.",
    price: 1200000,
    imageUrls: ["/Fotografer-wisuda.png"],
    durationMinutes: 240,
    isFeatured: true,
    location: "Bandung",
    vendorName: "Family Shots",
    vendorAvatar: "/young-indonesian-man-portrait.jpg",
    categoryName: "Fotografer",
    rating: 4.8,
    reviewCount: 67,
  },
  {
    id: "8",
    title: "Money Bouquet Wisuda",
    description:
      "Bouquet uang asli dengan dekorasi bunga. Nominal bisa custom. Wrapping premium!",
    price: 150000,
    imageUrls: ["/Bunga.png"],
    durationMinutes: null,
    isFeatured: false,
    location: "Bandung",
    vendorName: "Creative Gift BDG",
    vendorAvatar: "/young-indonesian-woman-portrait.png",
    categoryName: "Bunga & Hadiah",
    rating: 4.4,
    reviewCount: 38,
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
        <div className="flex items-center">
          <Image src="/Logo.svg" alt="Wisudahub" width={130} height={36} />
        </div>

        {/* Search Bar */}
        <div className="hidden flex-1 max-w-xl md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari fotografer, MUA, bunga..."
              className="w-full rounded-full border-0 bg-white/10 pl-10 pr-4 text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400"
            />
          </div>
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

function CategoryFilter({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}) {
  return (
    <div className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-[#0057AB] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterBar({
  sortBy,
  setSortBy,
  showFilter,
  setShowFilter,
}: {
  sortBy: string;
  setSortBy: (sort: string) => void;
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
}) {
  return (
    <div className="border-b bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilter(!showFilter)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
              {showFilter && <X className="h-3 w-3" />}
            </Button>
            <span className="text-sm text-gray-500">
              Menampilkan <strong>{mockServices.length}</strong> layanan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="featured">Rekomendasi</option>
              <option value="price-low">Harga: Terendah</option>
              <option value="price-high">Harga: Tertinggi</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="newest">Terbaru</option>
            </select>
          </div>
        </div>

        {/* Expanded Filter Panel */}
        {showFilter && (
          <div className="mt-4 grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Harga Minimum
              </label>
              <Input type="number" placeholder="Rp 0" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Harga Maksimum
              </label>
              <Input type="number" placeholder="Rp 2.000.000" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Lokasi
              </label>
              <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm">
                <option>Semua Lokasi</option>
                <option>Bandung</option>
                <option>Jakarta</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-[#0057AB] hover:bg-[#004080]">
                Terapkan Filter
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: (typeof mockServices)[0] }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.imageUrls[0] || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {service.isFeatured && (
          <Badge className="absolute left-3 top-3 bg-[#EFA90D] text-black">
            ⭐ Featured
          </Badge>
        )}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <Badge variant="secondary" className="mb-2 bg-blue-50 text-[#0057AB]">
          {service.categoryName}
        </Badge>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 group-hover:text-[#0057AB]">
          {service.title}
        </h3>

        {/* Vendor Info */}
        <div className="mb-3 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={service.vendorAvatar} />
            <AvatarFallback>{service.vendorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{service.vendorName}</span>
        </div>

        {/* Rating & Location */}
        <div className="mb-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{service.rating}</span>
            <span className="text-gray-400">({service.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-4 w-4" />
            {service.location}
          </div>
        </div>

        {/* Duration if applicable */}
        {service.durationMinutes && (
          <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {formatDuration(service.durationMinutes)}
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <p className="text-xs text-gray-500">Mulai dari</p>
            <p className="text-lg font-bold text-[#C0287F]">
              {formatPrice(service.price)}
            </p>
          </div>
          <Button size="sm" className="bg-[#0057AB] hover:bg-[#004080]">
            Lihat Detail
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServicesGrid({ services }: { services: typeof mockServices }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 text-center">
        <Button variant="outline" size="lg" className="gap-2">
          Muat Lebih Banyak
          <ChevronDown className="h-4 w-4" />
        </Button>
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
export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilter, setShowFilter] = useState(false);

  // Filter services based on active category
  const filteredServices =
    activeCategory === "all"
      ? mockServices
      : mockServices.filter((service) => {
          const categoryMap: Record<string, string> = {
            "1": "Fotografer",
            "2": "Make Up Artist",
            "3": "Bunga & Hadiah",
          };
          return service.categoryName === categoryMap[activeCategory];
        });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return 0; // Would use createdAt in real implementation
      default:
        return b.isFeatured ? 1 : -1;
    }
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <CategoryFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <FilterBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
      />
      <ServicesGrid services={sortedServices} />
      <Footer />
    </main>
  );
}
