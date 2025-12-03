"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/loading";
import { VendorRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  vendorsApi,
  bookingsApi,
  servicesApi,
  notificationsApi,
} from "@/lib/api";
import type {
  Vendor,
  VendorStats,
  Booking,
  Service,
  Notification as NotificationType,
} from "@/lib/api/types";

// ============ TYPES ============
interface VendorBookingDisplay {
  id: string;
  serviceName: string;
  serviceImage: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar: string;
  eventDate: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
  notes: string;
  paymentProofUrl?: string;
}

interface ServiceDisplay {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrls: string[];
  durationMinutes: number;
  isFeatured: boolean;
  location: string;
  categoryName: string;
  totalBookings: number;
  rating: number;
  status: string;
}

interface NotificationDisplay {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

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
function DashboardHeader({
  vendor,
  unreadCount,
  onLogout,
}: {
  vendor: Vendor | null;
  unreadCount: number;
  onLogout: () => void;
}) {
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
              <AvatarImage src={vendor?.avatarUrl || ""} />
              <AvatarFallback>
                {vendor?.displayName?.charAt(0) || "V"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {vendor?.displayName || "Vendor"}
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
  pendingBookingsCount,
  unreadNotificationsCount,
  onLogout,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingBookingsCount: number;
  unreadNotificationsCount: number;
  onLogout: () => void;
}) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    {
      id: "bookings",
      label: "Pesanan Masuk",
      icon: Package,
      badge: pendingBookingsCount,
    },
    { id: "services", label: "Layanan Saya", icon: FileText },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: Bell,
      badge: unreadNotificationsCount,
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
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
          >
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

function OverviewTab({
  stats,
  bookings,
  vendor,
}: {
  stats: VendorStats | null;
  bookings: Booking[];
  vendor: Vendor | null;
}) {
  const pendingBookings = bookings.filter(
    (b) => b.status === "requested"
  ).length;
  const activeBookings = bookings.filter((b) => b.status === "accepted").length;
  const completedBookings = stats?.completedBookings || 0;
  const thisMonthRevenue = stats?.thisMonthRevenue || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Selamat datang, {vendor?.displayName || "Vendor"}!
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
              <p className="text-sm text-green-700">Selesai</p>
              <p className="text-3xl font-bold text-green-800">
                {completedBookings}
              </p>
            </div>
            <div className="rounded-full bg-green-200 p-3">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-green-600">Total pesanan selesai</p>
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
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Belum ada pesanan
              </p>
            ) : (
              bookings.slice(0, 3).map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 rounded-lg border p-3"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={booking.customer?.avatarUrl || ""} />
                      <AvatarFallback>
                        {booking.customer?.name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {booking.customer?.name || "Customer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.service?.title || "Layanan"}
                      </p>
                    </div>
                    <Badge className={`${statusConfig.color} border`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                );
              })
            )}
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
                    {stats?.reviewCount || 0} ulasan
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.rating?.toFixed(1) || "0.0"}
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
                {stats?.totalBookings || 0}
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
                {formatCompactPrice(stats?.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingsTab({
  bookings,
  setBookings,
}: {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) {
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const handleAcceptBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const updatedBooking = await bookingsApi.updateStatus(bookingId, {
        status: "accepted",
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
      toast.success("Pesanan berhasil diterima!");
    } catch (error) {
      toast.error("Gagal menerima pesanan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const updatedBooking = await bookingsApi.updateStatus(bookingId, {
        status: "rejected",
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
      toast.success("Pesanan telah ditolak");
    } catch (error) {
      toast.error("Gagal menolak pesanan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const updatedBooking = await bookingsApi.updateStatus(bookingId, {
        status: "completed",
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
      toast.success("Pesanan telah diselesaikan!");
    } catch (error) {
      toast.error("Gagal menyelesaikan pesanan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmPayment = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const updatedBooking = await bookingsApi.updatePaymentStatus(bookingId, {
        paymentStatus: "paid",
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
      toast.success("Pembayaran telah dikonfirmasi!");
    } catch (error) {
      toast.error("Gagal mengkonfirmasi pembayaran");
    } finally {
      setActionLoading(null);
    }
  };

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
            count: bookings.filter((b) => b.status === "requested").length,
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
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">Tidak ada pesanan</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <VendorBookingCard
              key={booking.id}
              booking={booking}
              onAccept={() => handleAcceptBooking(booking.id)}
              onReject={() => handleRejectBooking(booking.id)}
              onComplete={() => handleCompleteBooking(booking.id)}
              onConfirmPayment={() => handleConfirmPayment(booking.id)}
              isLoading={actionLoading === booking.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

function VendorBookingCard({
  booking,
  onAccept,
  onReject,
  onComplete,
  onConfirmPayment,
  isLoading,
}: {
  booking: Booking;
  onAccept: () => void;
  onReject: () => void;
  onComplete: () => void;
  onConfirmPayment: () => void;
  isLoading: boolean;
}) {
  const statusConfig = getStatusConfig(booking.status);
  const paymentConfig = getPaymentStatusConfig(booking.paymentStatus);

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>#{booking.id.slice(0, 8).toUpperCase()}</span>
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
              <AvatarImage src={booking.customer?.avatarUrl || ""} />
              <AvatarFallback>
                {booking.customer?.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                {booking.customer?.name || "Customer"}
              </p>
              <p className="text-sm text-gray-500">
                {booking.customer?.email || "-"}
              </p>
              <p className="text-sm text-gray-500">
                {booking.customer?.phone || "-"}
              </p>
            </div>
          </div>

          {/* Service & Schedule */}
          <div className="flex-1 rounded-lg bg-gray-50 p-3">
            <p className="mb-2 font-medium text-gray-900">
              {booking.service?.title || "Layanan"}
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
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <a
                href={booking.paymentProofUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="h-4 w-4" />
                Lihat Bukti
              </a>
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
                onClick={onAccept}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Terima Pesanan
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                onClick={onReject}
                disabled={isLoading}
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
                    onClick={onConfirmPayment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Konfirmasi Pembayaran
                  </Button>
                )}
              <Button
                size="sm"
                className="gap-2 bg-[#0057AB] hover:bg-[#004080]"
                onClick={onComplete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
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

function ServicesTab({
  services,
  setServices,
}: {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;

    setDeleteLoading(serviceId);
    try {
      await servicesApi.delete(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast.success("Layanan berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus layanan");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Layanan Saya</h1>
          <p className="text-gray-600">Kelola layanan yang kamu tawarkan</p>
        </div>
        <Link href="/dashboard/vendor/services/add">
          <Button className="gap-2 bg-[#C0287F] hover:bg-[#a02169]">
            <Plus className="h-4 w-4" />
            Tambah Layanan
          </Button>
        </Link>
      </div>

      {/* Services Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {services.length === 0 ? (
          <div className="col-span-2 rounded-2xl border bg-white p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">Belum ada layanan</p>
            <Link href="/dashboard/vendor/services/add">
              <Button className="mt-4 gap-2 bg-[#C0287F] hover:bg-[#a02169]">
                <Plus className="h-4 w-4" />
                Tambah Layanan Pertama
              </Button>
            </Link>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="relative h-40">
                <Image
                  src={service.imageUrls[0] || "/placeholder.jpg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                {service.isFeatured && (
                  <Badge className="absolute left-3 top-3 bg-[#EFA90D] text-black">
                    ⭐ Featured
                  </Badge>
                )}
                {!service.isActive && (
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
                      {service.category?.name || "Kategori"}
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
                    <span>{service.rating?.toFixed(1) || "0.0"}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">
                    {service.totalBookings || 0} booking
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
                    <Link
                      href={`/dashboard/vendor/services/edit/${service.id}`}
                    >
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={deleteLoading === service.id}
                    >
                      {deleteLoading === service.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Add New Service Card */}
        <Link href="/dashboard/vendor/services/add">
          <button className="flex h-full min-h-[300px] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-gray-500 transition-all hover:border-[#C0287F] hover:bg-pink-50 hover:text-[#C0287F]">
            <div className="rounded-full bg-gray-200 p-4">
              <Plus className="h-8 w-8" />
            </div>
            <p className="font-medium">Tambah Layanan Baru</p>
          </button>
        </Link>
      </div>
    </div>
  );
}

function NotificationsTab({
  notifications,
  setNotifications,
}: {
  notifications: NotificationType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
}) {
  const toast = useToast();

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await notificationsApi.markAsRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (error) {
      toast.error("Gagal menandai notifikasi");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("Semua notifikasi telah ditandai sebagai dibaca");
    } catch (error) {
      toast.error("Gagal menandai notifikasi");
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      booking_created: <Package className="h-5 w-5 text-green-500" />,
      payment_received: <CreditCard className="h-5 w-5 text-orange-500" />,
      payment_confirmed: <CheckCircle className="h-5 w-5 text-green-500" />,
      review_received: <Star className="h-5 w-5 text-yellow-500" />,
      booking_accepted: <Check className="h-5 w-5 text-blue-500" />,
      booking_completed: <CheckCircle className="h-5 w-5 text-green-500" />,
      booking_cancelled: <XCircle className="h-5 w-5 text-red-500" />,
    };
    return icons[type] || <Bell className="h-5 w-5 text-gray-500" />;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
          <p className="text-gray-600">Update terbaru dari pesanan</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">Tidak ada notifikasi</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && handleMarkAsRead(notif.id)}
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
          ))
        )}
      </div>
    </div>
  );
}

function ProfileTab({ vendor }: { vendor: Vendor | null }) {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: vendor?.displayName || "",
    bio: vendor?.bio || "",
    location: vendor?.location || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await vendorsApi.update(formData);
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

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
              <AvatarImage src={vendor?.avatarUrl || ""} />
              <AvatarFallback className="text-3xl">
                {vendor?.displayName?.charAt(0) || "V"}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 rounded-full bg-[#C0287F] p-2 text-white shadow-lg hover:bg-[#a02169]">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <h2 className="text-2xl font-bold text-gray-900">
                {vendor?.displayName || "Nama Vendor"}
              </h2>
              {vendor?.isVerified && (
                <Badge className="bg-green-100 text-green-700">
                  Terverifikasi
                </Badge>
              )}
            </div>
            <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 md:justify-start">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">
                  {vendor?.rating?.toFixed(1) || "0.0"}
                </span>
                <span>({vendor?.reviewCount || 0} ulasan)</span>
              </div>
              <span>•</span>
              <span>{vendor?.totalBookings || 0} booking</span>
              <span>•</span>
              <span>
                Sejak{" "}
                {vendor?.createdAt
                  ? new Date(vendor.createdAt).getFullYear()
                  : "-"}
              </span>
            </div>
            <p className="text-gray-600">
              {vendor?.bio || "Belum ada deskripsi"}
            </p>
          </div>
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
            <Input
              value={formData.displayName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input value={user?.email || ""} type="email" disabled />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <Input value={user?.phone || ""} disabled />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Lokasi
            </label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Bio / Deskripsi
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={4}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#C0287F] focus:outline-none focus:ring-1 focus:ring-[#C0287F]"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            className="bg-[#C0287F] hover:bg-[#a02169]"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
function VendorDashboardContent() {
  const { user, vendor, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // State for real data
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [statsResult, bookingsResult, servicesResult, notificationsResult] =
        await Promise.allSettled([
          vendorsApi.getStats(), // may not be available; ignore on failure
          bookingsApi.getVendorBookings(),
          servicesApi.getMine(),
          notificationsApi.getAll(),
        ]);

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
      } else {
        setStats(null);
      }

      if (bookingsResult.status === "fulfilled") {
        setBookings(bookingsResult.value);
      } else {
        setBookings([]);
      }

      if (servicesResult.status === "fulfilled") {
        setServices(servicesResult.value);
      } else {
        setServices([]);
      }

      if (notificationsResult.status === "fulfilled") {
        setNotifications(notificationsResult.value);
      } else {
        setNotifications([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [toast, vendor]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch {
      toast.error("Gagal keluar");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#C0287F]" />
            <p className="mt-2 text-gray-600">Memuat data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab stats={stats} bookings={bookings} vendor={vendor} />
        );
      case "bookings":
        return <BookingsTab bookings={bookings} setBookings={setBookings} />;
      case "services":
        return <ServicesTab services={services} setServices={setServices} />;
      case "notifications":
        return (
          <NotificationsTab
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      case "profile":
        return <ProfileTab vendor={vendor} />;
      case "settings":
        return <SettingsTab />;
      default:
        return (
          <OverviewTab stats={stats} bookings={bookings} vendor={vendor} />
        );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingBookingsCount = bookings.filter(
    (b) => b.status === "requested"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader
        vendor={vendor}
        unreadCount={unreadCount}
        onLogout={handleLogout}
      />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingBookingsCount={pendingBookingsCount}
          unreadNotificationsCount={unreadCount}
          onLogout={handleLogout}
        />

        <div className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8">{renderContent()}</div>
        </div>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}

export default function VendorDashboardPage() {
  return (
    <VendorRoute>
      <VendorDashboardContent />
    </VendorRoute>
  );
}
