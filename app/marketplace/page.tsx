"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  X,
  Loader2,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/loading";
import { useAuth } from "@/contexts/AuthContext";
import { servicesApi, categoriesApi } from "@/lib/api";
import type { Service, Category } from "@/lib/api/types";
import { useDebounce } from "@/hooks";

// ============ DEFAULT DATA (Fallback) ============
const defaultCategories = [
  { id: "all", name: "Semua", slug: "all", icon: "🎓" },
  { id: "1", name: "Fotografer", slug: "fotografer", icon: "📷" },
  { id: "2", name: "Make Up Artist", slug: "mua", icon: "💄" },
  { id: "3", name: "Bunga & Hadiah", slug: "bunga", icon: "🌸" },
];

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
  vendorName: string;
  vendorAvatar: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
}

interface CategoryDisplay {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

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
function Header({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-0 bg-white/10 pl-10 pr-4 text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link
                href={
                  user.role === "vendor"
                    ? "/dashboard/vendor"
                    : "/dashboard/customer"
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

function CategoryFilter({
  categories,
  activeCategory,
  setActiveCategory,
}: {
  categories: CategoryDisplay[];
  activeCategory: string;
  setActiveCategory: (slug: string) => void;
}) {
  return (
    <div className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.slug)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === category.slug
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
  totalServices,
  isLoading,
  onApplyFilter,
}: {
  sortBy: string;
  setSortBy: (sort: string) => void;
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  totalServices: number;
  isLoading: boolean;
  onApplyFilter: (filters: { minPrice?: number; maxPrice?: number }) => void;
}) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApplyFilter = () => {
    onApplyFilter({
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    });
  };

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
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memuat...
                </span>
              ) : (
                <>
                  Menampilkan <strong>{totalServices}</strong> layanan
                </>
              )}
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
              <Input
                type="number"
                placeholder="Rp 0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Harga Maksimum
              </label>
              <Input
                type="number"
                placeholder="Rp 2.000.000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
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
              <Button
                onClick={handleApplyFilter}
                className="w-full bg-[#0057AB] hover:bg-[#004080]"
              >
                Terapkan Filter
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceDisplay }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Link href={`/service/${service.id}`} className="block h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
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
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
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
        <div className="flex flex-1 flex-col p-4">
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
            {service.location && (
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="h-4 w-4" />
                {service.location}
              </div>
            )}
          </div>

          {/* Duration if applicable */}
          {service.durationMinutes && (
            <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {formatDuration(service.durationMinutes)}
            </div>
          )}

          {/* Price & Action */}
          <div className="mt-auto flex items-center justify-between border-t pt-3">
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
    </Link>
  );
}

function ServicesGrid({
  services,
  isLoading,
  hasMore,
  onLoadMore,
}: {
  services: ServiceDisplay[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  if (isLoading && services.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && services.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak ada layanan ditemukan
          </h3>
          <p className="text-gray-500 mb-4">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              <>
                Muat Lebih Banyak
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
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
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [services, setServices] = useState<ServiceDisplay[]>([]);
  const [categories, setCategories] =
    useState<CategoryDisplay[]>(defaultCategories);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalServices, setTotalServices] = useState(0);
  const [priceFilters, setPriceFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
  }>({});

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get category from URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        if (data && Array.isArray(data)) {
          const iconMap: Record<string, string> = {
            fotografer: "📷",
            mua: "💄",
            bunga: "🌸",
            hadiah: "🎁",
          };

          const mappedCategories: CategoryDisplay[] = [
            { id: "all", name: "Semua", slug: "all", icon: "🎓" },
            ...data.map((cat: Category) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              icon: iconMap[cat.slug] || "📦",
            })),
          ];
          setCategories(mappedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Map API service to display format
  const mapServiceToDisplay = (service: Service): ServiceDisplay => ({
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    imageUrls: service.imageUrls || ["/placeholder.svg"],
    durationMinutes: service.durationMinutes || null,
    isFeatured: service.isFeatured || false,
    location: service.vendor?.location || "",
    vendorName: service.vendor?.displayName || "Vendor",
    vendorAvatar: service.vendor?.avatarUrl || "/placeholder.svg",
    categoryName: service.category?.name || "Layanan",
    rating: service.rating || 0,
    reviewCount: service.reviewCount || 0,
  });

  // Fetch services
  const fetchServices = useCallback(
    async (reset = false) => {
      try {
        setIsLoading(true);
        const currentPage = reset ? 1 : page;

        const params: Record<string, string | number | boolean> = {
          page: currentPage,
          limit: 12,
        };

        if (activeCategory !== "all") {
          // Find category id by slug
          const cat = categories.find((c) => c.slug === activeCategory);
          if (cat && cat.id !== "all" && isUuid(cat.id)) {
            params.categoryId = cat.id;
          }
        }

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (priceFilters.minPrice) {
          params.minPrice = priceFilters.minPrice;
        }

        if (priceFilters.maxPrice) {
          params.maxPrice = priceFilters.maxPrice;
        }

        // Sort mapping
        if (sortBy === "price-low") {
          params.sortBy = "price";
          params.sortOrder = "asc";
        } else if (sortBy === "price-high") {
          params.sortBy = "price";
          params.sortOrder = "desc";
        } else if (sortBy === "rating") {
          params.sortBy = "rating";
          params.sortOrder = "desc";
        } else if (sortBy === "newest") {
          params.sortBy = "createdAt";
          params.sortOrder = "desc";
        }

        const data = await servicesApi.getAll(params);

        if (data && Array.isArray(data)) {
          const mappedServices = data.map(mapServiceToDisplay);

          if (reset) {
            setServices(mappedServices);
            setPage(1);
          } else {
            setServices((prev) => [...prev, ...mappedServices]);
          }

          // Check if there are more pages (12 is page limit)
          setHasMore(mappedServices.length === 12);
          setTotalServices(
            reset
              ? mappedServices.length
              : services.length + mappedServices.length
          );
        } else {
          // No data from API
          if (reset) {
            setServices([]);
          }
          setHasMore(false);
          setTotalServices(0);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
        // Show empty state on error
        if (services.length === 0) {
          setServices([]);
          setTotalServices(0);
        }
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [activeCategory, debouncedSearch, sortBy, page, categories, priceFilters]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    fetchServices(true);
  }, [activeCategory, debouncedSearch, sortBy, priceFilters, categories]);

  // Handle category change with URL update
  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "all") {
      router.push("/marketplace");
    } else {
      router.push(`/marketplace?category=${slug}`);
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchServices(false);
  };

  // Handle apply filter
  const handleApplyFilter = (filters: {
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setPriceFilters(filters);
    setShowFilter(false);
  };

  // Client-side sort for featured (if not handled by API)
  const displayServices =
    sortBy === "featured"
      ? [...services].sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        )
      : services;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
      />
      <FilterBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        totalServices={totalServices}
        isLoading={isLoading}
        onApplyFilter={handleApplyFilter}
      />
      <ServicesGrid
        services={displayServices}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
      <Footer />
    </main>
  );
}
