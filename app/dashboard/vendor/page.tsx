"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Bell,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  LogOut,
  Settings,
  CreditCard,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Star,
  Instagram,
  Search,
  FileText,
  Camera,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Store,
  Phone,
  Mail,
  ChevronDown,
  Check,
  X,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============ MOCK DATA ============
const mockVendor = {
  id: "v1",
  userId: "u1",
  displayName: "Bandung Photo Studio",
  email: "bandungphoto@email.com",
  phone: "+62 812-3456-7890",
  bio: "Studio foto profesional di Bandung sejak 2019. Spesialisasi foto wisuda, prewedding, dan portrait. Sudah melayani 500+ klien dengan rating 4.9/5.",
  location: "Jl. Dago No. 123, Bandung",
  avatar: "/young-indonesian-man-portrait.jpg",
  joinedDate: "2019",
  totalServices: 5,
  totalBookings: 342,
  totalRevenue: 285000000,
  rating: 4.9,
  reviewCount: 128,
};

const mockServices = [
  {
    id: "s1",
    title: "Paket Foto Wisuda Premium ITB",
    description:
      "3 jam pemotretan, 60 foto edit, area kampus ITB dan sekitarnya.",
    price: 850000,
    imageUrls: ["/Fotografer-wisuda.png"],
    durationMinutes: 180,
    isFeatured: true,
    location: "Bandung",
    categoryName: "Fotografer",
    totalBookings: 128,
    rating: 4.9,
    status: "active",
  },
  {
    id: "s2",
    title: "Paket Foto Candid Wisuda",
    description: "2 jam foto candid moment wisuda. 40 foto edit.",
    price: 450000,
    imageUrls: ["/Fotografer-wisuda.png"],
    durationMinutes: 120,
    isFeatured: false,
    location: "Bandung",
    categoryName: "Fotografer",
    totalBookings: 72,
    rating: 4.6,
    status: "active",
  },
  {
    id: "s3",
    title: "Paket Foto Keluarga Wisuda",
    description: "4 jam, unlimited foto, 100 foto edit untuk keluarga besar.",
    price: 1200000,
    imageUrls: ["/Fotografer-wisuda.png"],
    durationMinutes: 240,
    isFeatured: true,
    location: "Bandung",
    categoryName: "Fotografer",
    totalBookings: 67,
    rating: 4.8,
    status: "active",
  },
  {
    id: "s4",
    title: "Foto Wisuda Express",
    description: "1 jam pemotretan cepat, 20 foto edit.",
    price: 300000,
    imageUrls: ["/Fotografer-wisuda.png"],
    durationMinutes: 60,
    isFeatured: false,
    location: "Bandung",
    categoryName: "Fotografer",
    totalBookings: 45,
    rating: 4.5,
    status: "draft",
  },
];

const mockVendorBookings = [
  {
    id: "b1",
    serviceName: "Paket Foto Wisuda Premium ITB",
    serviceImage: "/Fotografer-wisuda.png",
    customerName: "Sarah Putri",
    customerEmail: "sarah@email.com",
    customerPhone: "+62 812-1111-2222",
    customerAvatar: "/young-indonesian-woman-portrait.png",
    eventDate: "2025-07-15T08:00:00",
    status: "requested",
    paymentStatus: "pending",
    totalPrice: 850000,
    createdAt: "2024-12-02T10:00:00",
    notes: "Foto di area Aula Barat dan Taman Ganesha",
  },
  {
    id: "b2",
    serviceName: "Paket Foto Candid Wisuda",
    serviceImage: "/Fotografer-wisuda.png",
    customerName: "Ahmad Rizki",
    customerEmail: "ahmad@email.com",
    customerPhone: "+62 812-3333-4444",
    customerAvatar: "/young-indonesian-man-portrait.jpg",
    eventDate: "2025-07-16T09:00:00",
    status: "accepted",
    paymentStatus: "paid",
    totalPrice: 450000,
    createdAt: "2024-12-01T14:00:00",
    notes: "Fokus candid moment saat prosesi",
  },
  {
    id: "b3",
    serviceName: "Paket Foto Keluarga Wisuda",
    serviceImage: "/Fotografer-wisuda.png",
    customerName: "Dewi Lestari",
    customerEmail: "dewi@email.com",
    customerPhone: "+62 812-5555-6666",
    customerAvatar: "/young-indonesian-woman-portrait.png",
    eventDate: "2025-07-14T07:00:00",
    status: "accepted",
    paymentStatus: "pending",
    totalPrice: 1200000,
    createdAt: "2024-11-28T11:00:00",
    notes: "Keluarga besar ±20 orang, butuh waktu lebih",
    paymentProofUrl: "/payment-proof.jpg",
  },
  {
    id: "b4",
    serviceName: "Paket Foto Wisuda Premium ITB",
    serviceImage: "/Fotografer-wisuda.png",
    customerName: "Budi Santoso",
    customerEmail: "budi@email.com",
    customerPhone: "+62 812-7777-8888",
    customerAvatar: "/young-indonesian-man-smiling-portrait.jpg",
    eventDate: "2024-10-20T08:00:00",
    status: "completed",
    paymentStatus: "paid",
    totalPrice: 850000,
    createdAt: "2024-10-15T09:00:00",
    notes: "",
  },
];

const mockNotifications = [
  {
    id: "n1",
    type: "booking_created",
    title: "Pesanan Baru! 🎉",
    body: "Sarah Putri memesan Paket Foto Wisuda Premium ITB",
    read: false,
    createdAt: "2024-12-02T10:00:00",
  },
  {
    id: "n2",
    type: "payment_proof",
    title: "Bukti Pembayaran Diunggah",
    body: "Dewi Lestari mengunggah bukti pembayaran untuk Paket Foto Keluarga",
    read: false,
    createdAt: "2024-12-01T16:00:00",
  },
  {
    id: "n3",
    type: "review",
    title: "Ulasan Baru ⭐",
    body: "Budi Santoso memberikan ulasan 5 bintang untuk layanan Anda",
    read: true,
    createdAt: "2024-10-22T12:00:00",
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

function formatCompactPrice(price: number) {
  if (price >= 1000000000) return `Rp ${(price / 1000000000).toFixed(1)}M`;
  if (price >= 1000000) return `Rp ${(price / 1000000).toFixed(0)}jt`;
  return formatPrice(price);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  return `${hours} jam`;
}

function getStatusConfig(status: string) {
  const configs: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    requested: {
      label: "Menunggu Konfirmasi",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <Clock className="h-4 w-4" />,
    },
    accepted: {
      label: "Diterima",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    completed: {
      label: "Selesai",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    cancelled: {
      label: "Dibatalkan",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: <XCircle className="h-4 w-4" />,
    },
  };
  return configs[status] || configs.requested;
}

function getPaymentStatusConfig(status: string) {
  const configs: Record<string, { label: string; color: string }> = {
    pending: { label: "Belum Bayar", color: "bg-orange-100 text-orange-700" },
    paid: { label: "Lunas", color: "bg-green-100 text-green-700" },
    failed: { label: "Gagal", color: "bg-red-100 text-red-700" },
  };
  return configs[status] || configs.pending;
}

// ============ ICONS ============
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

// ============ COMPONENTS ============
function DashboardHeader() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src="/Logo.svg" alt="Wisudahub" width={130} height={36} />
          </Link>
          <Badge className="hidden bg-[#C0287F] text-white md:inline-flex">
            <Store className="mr-1 h-3 w-3" />
            Vendor Dashboard
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={mockVendor.avatar} />
              <AvatarFallback>
                {mockVendor.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {mockVendor.displayName}
              </p>
              <p className="text-xs text-gray-500">Vendor</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    {
      id: "bookings",
      label: "Pesanan Masuk",
      icon: Package,
      badge: mockVendorBookings.filter((b) => b.status === "requested").length,
    },
    { id: "services", label: "Layanan Saya", icon: FileText },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: Bell,
      badge: mockNotifications.filter((n) => !n.read).length,
    },
    { id: "profile", label: "Profil Vendor", icon: Store },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <aside className="hidden w-64 border-r bg-white lg:block">
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all ${
                  activeTab === item.id
                    ? "bg-pink-50 text-[#C0287F]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <Badge className="bg-red-500 text-white">{item.badge}</Badge>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t pt-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

function MobileNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "bookings", label: "Pesanan", icon: Package },
    { id: "services", label: "Layanan", icon: FileText },
    { id: "profile", label: "Profil", icon: Store },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white lg:hidden">
      <div className="flex justify-around py-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === item.id ? "text-[#C0287F]" : "text-gray-500"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function OverviewTab() {
  const pendingBookings = mockVendorBookings.filter(
    (b) => b.status === "requested"
  ).length;
  const activeBookings = mockVendorBookings.filter(
    (b) => b.status === "accepted"
  ).length;
  const completedBookings = mockVendorBookings.filter(
    (b) => b.status === "completed"
  ).length;
  const thisMonthRevenue = mockVendorBookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Selamat datang, {mockVendor.displayName}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Pesanan Baru</p>
              <p className="text-3xl font-bold text-yellow-800">
                {pendingBookings}
              </p>
            </div>
            <div className="rounded-full bg-yellow-200 p-3">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-yellow-600">Menunggu konfirmasi</p>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-blue-50 to-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Sedang Berjalan</p>
              <p className="text-3xl font-bold text-blue-800">
                {activeBookings}
              </p>
            </div>
            <div className="rounded-full bg-blue-200 p-3">
              <Package className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-blue-600">Pesanan aktif</p>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-green-50 to-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Selesai Bulan Ini</p>
              <p className="text-3xl font-bold text-green-800">
                {completedBookings}
              </p>
            </div>
            <div className="rounded-full bg-green-200 p-3">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-green-600">Pesanan selesai</p>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-pink-50 to-pink-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pink-700">Pendapatan</p>
              <p className="text-2xl font-bold text-pink-800">
                {formatCompactPrice(thisMonthRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-pink-200 p-3">
              <DollarSign className="h-6 w-6 text-pink-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-pink-600">Bulan ini</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Pesanan Terbaru</h3>
            <Button variant="ghost" size="sm" className="text-[#C0287F]">
              Lihat Semua
            </Button>
          </div>
          <div className="space-y-4">
            {mockVendorBookings.slice(0, 3).map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              return (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.customerAvatar} />
                    <AvatarFallback>
                      {booking.customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.serviceName}
                    </p>
                  </div>
                  <Badge className={`${statusConfig.color} border`}>
                    {statusConfig.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance */}
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Performa</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-100 p-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rating</p>
                  <p className="text-sm text-gray-500">
                    {mockVendor.reviewCount} ulasan
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockVendor.rating}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total Customer</p>
                  <p className="text-sm text-gray-500">Sejak bergabung</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockVendor.totalBookings}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total Pendapatan</p>
                  <p className="text-sm text-gray-500">Sejak bergabung</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCompactPrice(mockVendor.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingsTab() {
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const filteredBookings =
    filter === "all"
      ? mockVendorBookings
      : mockVendorBookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pesanan Masuk</h1>
        <p className="text-gray-600">Kelola pesanan dari customer</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "all", label: "Semua" },
          {
            id: "requested",
            label: "Menunggu",
            count: mockVendorBookings.filter((b) => b.status === "requested")
              .length,
          },
          { id: "accepted", label: "Diterima" },
          { id: "completed", label: "Selesai" },
          { id: "cancelled", label: "Dibatalkan" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === tab.id
                ? "bg-[#C0287F] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            {tab.count && tab.count > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  filter === tab.id ? "bg-white/20" : "bg-red-500 text-white"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <VendorBookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}

function VendorBookingCard({
  booking,
}: {
  booking: (typeof mockVendorBookings)[0];
}) {
  const statusConfig = getStatusConfig(booking.status);
  const paymentConfig = getPaymentStatusConfig(booking.paymentStatus);
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>#{booking.id.toUpperCase()}</span>
          <span>•</span>
          <span>{formatDateTime(booking.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${paymentConfig.color}`}>
            {paymentConfig.label}
          </Badge>
          <Badge className={`${statusConfig.color} gap-1 border`}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {/* Customer Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={booking.customerAvatar} />
              <AvatarFallback>{booking.customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                {booking.customerName}
              </p>
              <p className="text-sm text-gray-500">{booking.customerEmail}</p>
              <p className="text-sm text-gray-500">{booking.customerPhone}</p>
            </div>
          </div>

          {/* Service & Schedule */}
          <div className="flex-1 rounded-lg bg-gray-50 p-3">
            <p className="mb-2 font-medium text-gray-900">
              {booking.serviceName}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(booking.eventDate)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(booking.eventDate)}
              </div>
            </div>
            {booking.notes && (
              <p className="mt-2 text-sm text-gray-500">
                <span className="font-medium">Catatan:</span> {booking.notes}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-[#C0287F]">
              {formatPrice(booking.totalPrice)}
            </p>
          </div>
        </div>

        {/* Payment Proof */}
        {booking.paymentProofUrl && booking.paymentStatus === "pending" && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="font-medium text-orange-700">
                Bukti pembayaran diunggah
              </p>
              <p className="text-sm text-orange-600">
                Mohon verifikasi pembayaran customer
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Lihat Bukti
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          {booking.status === "requested" && (
            <>
              <Button
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
                Terima Pesanan
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Tolak
              </Button>
            </>
          )}
          {booking.status === "accepted" && (
            <>
              {booking.paymentProofUrl &&
                booking.paymentStatus === "pending" && (
                  <Button
                    size="sm"
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Konfirmasi Pembayaran
                  </Button>
                )}
              <Button
                size="sm"
                className="gap-2 bg-[#0057AB] hover:bg-[#004080]"
              >
                <CheckCircle className="h-4 w-4" />
                Selesaikan Pesanan
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat Customer
          </Button>
          <Button size="sm" variant="ghost" className="gap-2">
            <Eye className="h-4 w-4" />
            Detail
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServicesTab() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Layanan Saya</h1>
          <p className="text-gray-600">Kelola layanan yang kamu tawarkan</p>
        </div>
        <Button className="gap-2 bg-[#C0287F] hover:bg-[#a02169]">
          <Plus className="h-4 w-4" />
          Tambah Layanan
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {mockServices.map((service) => (
          <div
            key={service.id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          >
            <div className="relative h-40">
              <Image
                src={service.imageUrls[0]}
                alt={service.title}
                fill
                className="object-cover"
              />
              {service.isFeatured && (
                <Badge className="absolute left-3 top-3 bg-[#EFA90D] text-black">
                  ⭐ Featured
                </Badge>
              )}
              {service.status === "draft" && (
                <Badge className="absolute right-3 top-3 bg-gray-500 text-white">
                  Draft
                </Badge>
              )}
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {service.categoryName}
                  </p>
                </div>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                {service.description}
              </p>

              <div className="mb-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{service.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">
                  {service.totalBookings} booking
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">
                  {formatDuration(service.durationMinutes)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-lg font-bold text-[#C0287F]">
                  {formatPrice(service.price)}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Service Card */}
        <button className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-gray-500 transition-all hover:border-[#C0287F] hover:bg-pink-50 hover:text-[#C0287F]">
          <div className="rounded-full bg-gray-200 p-4">
            <Plus className="h-8 w-8" />
          </div>
          <p className="font-medium">Tambah Layanan Baru</p>
        </button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      booking_created: <Package className="h-5 w-5 text-green-500" />,
      payment_proof: <CreditCard className="h-5 w-5 text-orange-500" />,
      review: <Star className="h-5 w-5 text-yellow-500" />,
    };
    return icons[type] || <Bell className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
        <p className="text-gray-600">Update terbaru dari pesanan</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
              notif.read ? "bg-white" : "border-pink-200 bg-pink-50"
            }`}
          >
            <div className="flex gap-4">
              <div className="rounded-full bg-gray-100 p-2">
                {getNotificationIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-start justify-between">
                  <h3
                    className={`font-medium ${
                      notif.read ? "text-gray-700" : "text-gray-900"
                    }`}
                  >
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-[#C0287F]" />
                  )}
                </div>
                <p className="mb-2 text-sm text-gray-600">{notif.body}</p>
                <p className="text-xs text-gray-400">
                  {formatDateTime(notif.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Vendor</h1>
        <p className="text-gray-600">Kelola informasi bisnis kamu</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="relative">
            <Avatar className="h-28 w-28">
              <AvatarImage src={mockVendor.avatar} />
              <AvatarFallback className="text-3xl">
                {mockVendor.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 rounded-full bg-[#C0287F] p-2 text-white shadow-lg hover:bg-[#a02169]">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <h2 className="text-2xl font-bold text-gray-900">
                {mockVendor.displayName}
              </h2>
              <Badge className="bg-green-100 text-green-700">
                Terverifikasi
              </Badge>
            </div>
            <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 md:justify-start">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">
                  {mockVendor.rating}
                </span>
                <span>({mockVendor.reviewCount} ulasan)</span>
              </div>
              <span>•</span>
              <span>{mockVendor.totalBookings} booking</span>
              <span>•</span>
              <span>Sejak {mockVendor.joinedDate}</span>
            </div>
            <p className="text-gray-600">{mockVendor.bio}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 text-center">
          <FileText className="mx-auto mb-2 h-6 w-6 text-[#0057AB]" />
          <p className="text-2xl font-bold text-gray-900">
            {mockVendor.totalServices}
          </p>
          <p className="text-sm text-gray-500">Layanan Aktif</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Package className="mx-auto mb-2 h-6 w-6 text-green-500" />
          <p className="text-2xl font-bold text-gray-900">
            {mockVendor.totalBookings}
          </p>
          <p className="text-sm text-gray-500">Total Booking</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Star className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
          <p className="text-2xl font-bold text-gray-900">
            {mockVendor.rating}
          </p>
          <p className="text-sm text-gray-500">Rating</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <DollarSign className="mx-auto mb-2 h-6 w-6 text-[#C0287F]" />
          <p className="text-xl font-bold text-gray-900">
            {formatCompactPrice(mockVendor.totalRevenue)}
          </p>
          <p className="text-sm text-gray-500">Pendapatan</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-2xl border bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Informasi Bisnis</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nama Bisnis
            </label>
            <Input defaultValue={mockVendor.displayName} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input defaultValue={mockVendor.email} type="email" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <Input defaultValue={mockVendor.phone} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Lokasi
            </label>
            <Input defaultValue={mockVendor.location} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Bio / Deskripsi
            </label>
            <textarea
              defaultValue={mockVendor.bio}
              rows={4}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#C0287F] focus:outline-none focus:ring-1 focus:ring-[#C0287F]"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button className="bg-[#C0287F] hover:bg-[#a02169]">
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600">Kelola preferensi akun vendor</p>
      </div>

      <div className="space-y-4">
        {/* Notification Settings */}
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Notifikasi</h3>
          <div className="space-y-4">
            {[
              {
                label: "Pesanan baru",
                desc: "Notifikasi saat ada pesanan masuk",
              },
              {
                label: "Pembayaran",
                desc: "Update status pembayaran customer",
              },
              { label: "Ulasan baru", desc: "Notifikasi saat dapat ulasan" },
              {
                label: "Promo WisudaHub",
                desc: "Info program dan promo dari platform",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#C0287F] peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Account */}
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">
            Rekening Pencairan
          </h3>
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Bank BCA</p>
                <p className="text-sm text-gray-500">**** **** **** 1234</p>
                <p className="text-sm text-gray-500">
                  a.n. Bandung Photo Studio
                </p>
              </div>
              <Button variant="outline" size="sm">
                Ubah
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "bookings":
        return <BookingsTab />;
      case "services":
        return <ServicesTab />;
      case "notifications":
        return <NotificationsTab />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader />

      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8">{renderContent()}</div>
        </div>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
