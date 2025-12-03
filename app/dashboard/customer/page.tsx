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
  Upload,
  Eye,
  MessageCircle,
  Star,
  Instagram,
  Home,
  Search,
  FileText,
  Camera,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/loading";
import { ErrorDisplay, EmptyState } from "@/components/ui/error";
import { CustomerRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { bookingsApi, notificationsApi, usersApi } from "@/lib/api";
import type {
  Booking,
  Notification as NotificationType,
  User as UserType,
} from "@/lib/api/types";

// ============ TYPES ============
interface BookingDisplay {
  id: string;
  serviceName: string;
  serviceImage: string;
  vendorName: string;
  vendorAvatar: string;
  eventDate: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  totalPrice: number;
  createdAt: string;
  notes: string;
  serviceId: string;
}

interface NotificationDisplay {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  metadata: Record<string, unknown>;
}

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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
function DashboardHeader({ unreadCount = 0 }: { unreadCount?: number }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil keluar");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Gagal keluar");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/">
          <Image src="/Logo.svg" alt="Wisudahub" width={130} height={36} />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Cari Layanan</span>
            </Button>
          </Link>

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
              <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">Customer</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  activeTab,
  setActiveTab,
  unreadCount = 0,
  onLogout,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
  onLogout?: () => void;
}) {
  const menuItems = [
    { id: "bookings", label: "Pesanan Saya", icon: Package },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: Bell,
      badge: unreadCount,
    },
    { id: "profile", label: "Profil", icon: User },
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
                    ? "bg-blue-50 text-[#0057AB]"
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
    { id: "bookings", label: "Pesanan", icon: Package },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white lg:hidden">
      <div className="flex justify-around py-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === item.id ? "text-[#0057AB]" : "text-gray-500"
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

function BookingsTab({
  bookings,
  isLoading,
}: {
  bookings: BookingDisplay[];
  isLoading: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  const toast = useToast();

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;

    try {
      await bookingsApi.cancel(bookingId, "Dibatalkan oleh customer");
      toast.success("Pesanan berhasil dibatalkan");
      // Reload page to refresh data
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Gagal membatalkan pesanan");
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border bg-white p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
        <p className="text-gray-600">
          Kelola semua pesanan layanan wisuda kamu
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "all", label: "Semua" },
          { id: "requested", label: "Menunggu" },
          { id: "accepted", label: "Diterima" },
          { id: "completed", label: "Selesai" },
          { id: "cancelled", label: "Dibatalkan" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === tab.id
                ? "bg-[#0057AB] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 font-semibold text-gray-900">
              {filter === "all"
                ? "Belum ada pesanan"
                : `Tidak ada pesanan ${filter}`}
            </h3>
            <p className="mb-4 text-gray-500">
              Yuk mulai cari layanan wisuda impianmu!
            </p>
            <Link href="/marketplace">
              <Button className="bg-[#0057AB] hover:bg-[#004080]">
                Cari Layanan
              </Button>
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => handleCancelBooking(booking.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
}: {
  booking: BookingDisplay;
  onCancel?: () => void;
}) {
  const statusConfig = getStatusConfig(booking.status);
  const paymentConfig = getPaymentStatusConfig(booking.paymentStatus);
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>Booking #{booking.id.slice(0, 8).toUpperCase()}</span>
          <span>•</span>
          <span>{formatDateTime(booking.createdAt)}</span>
        </div>
        <Badge className={`${statusConfig.color} gap-1 border`}>
          {statusConfig.icon}
          {statusConfig.label}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={booking.serviceImage}
              alt={booking.serviceName}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <Link href={`/service/${booking.serviceId}`}>
              <h3 className="mb-1 font-semibold text-gray-900 hover:text-[#0057AB]">
                {booking.serviceName}
              </h3>
            </Link>
            <div className="mb-2 flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={booking.vendorAvatar} />
                <AvatarFallback>{booking.vendorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">
                {booking.vendorName}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(booking.eventDate)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(booking.eventDate)}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-bold text-[#C0287F]">
              {formatPrice(booking.totalPrice)}
            </p>
            <Badge className={`${paymentConfig.color} mt-1`}>
              {paymentConfig.label}
            </Badge>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <span className="font-medium">Catatan:</span> {booking.notes}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          {/* Payment actions for pending */}
          {booking.status === "accepted" &&
            booking.paymentStatus === "pending" && (
              <Link href={`/checkout/${booking.id}`}>
                <Button
                  size="sm"
                  className="gap-2 bg-[#C0287F] hover:bg-[#a02169]"
                >
                  <CreditCard className="h-4 w-4" />
                  Bayar Sekarang
                </Button>
              </Link>
            )}

          {/* Review button for completed */}
          {booking.status === "completed" && (
            <Button size="sm" variant="outline" className="gap-2">
              <Star className="h-4 w-4" />
              Beri Ulasan
            </Button>
          )}

          {/* View service */}
          <Link href={`/service/${booking.serviceId}`}>
            <Button size="sm" variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Lihat Layanan
            </Button>
          </Link>

          {/* Cancel button for requested */}
          {booking.status === "requested" && onCancel && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onCancel}
            >
              <XCircle className="h-4 w-4" />
              Batalkan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
}: {
  notifications: NotificationDisplay[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}) {
  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      booking_created: <Package className="h-5 w-5 text-blue-500" />,
      booking_accepted: <CheckCircle className="h-5 w-5 text-green-500" />,
      booking_rejected: <XCircle className="h-5 w-5 text-red-500" />,
      booking_completed: <CheckCircle className="h-5 w-5 text-green-500" />,
      booking_cancelled: <XCircle className="h-5 w-5 text-red-500" />,
      payment_received: <CreditCard className="h-5 w-5 text-green-500" />,
      payment_confirmed: <CheckCircle className="h-5 w-5 text-green-500" />,
      review_received: <Star className="h-5 w-5 text-yellow-500" />,
      system: <Bell className="h-5 w-5 text-gray-500" />,
    };
    return icons[type] || <Bell className="h-5 w-5 text-gray-500" />;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
          <p className="text-gray-600">Update terbaru untuk pesananmu</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            Tandai semua dibaca
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 font-semibold text-gray-900">
            Belum ada notifikasi
          </h3>
          <p className="text-gray-500">
            Notifikasi terbaru akan muncul di sini
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && onMarkAsRead(notif.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
                notif.read ? "bg-white" : "border-blue-200 bg-blue-50"
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
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
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
      )}
    </div>
  );
}

function ProfileTab({ bookings }: { bookings: BookingDisplay[] }) {
  const { user } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      await usersApi.update(user.id, {
        name: formData.name,
        phone: formData.phone,
      });
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "-";

  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-600">Kelola informasi akun kamu</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 rounded-full bg-[#0057AB] p-2 text-white shadow-lg hover:bg-[#004080]">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.name || "User"}
            </h2>
            <p className="text-gray-500">{user?.email || "-"}</p>
            <p className="mt-1 text-sm text-gray-400">
              Bergabung sejak {joinedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 text-center">
          <Package className="mx-auto mb-2 h-8 w-8 text-[#0057AB]" />
          <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          <p className="text-sm text-gray-500">Total Pesanan</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
          <p className="text-2xl font-bold text-gray-900">
            {completedBookings}
          </p>
          <p className="text-sm text-gray-500">Selesai</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Star className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
          <p className="text-2xl font-bold text-gray-900">
            {completedBookings}
          </p>
          <p className="text-sm text-gray-500">Ulasan Diberikan</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-2xl border bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Informasi Pribadi</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              value={formData.email}
              type="email"
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+62 812-xxxx-xxxx"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            className="bg-[#0057AB] hover:bg-[#004080]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-2xl border bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Keamanan</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Ubah password akun Anda</p>
            </div>
            <Button variant="outline" size="sm">
              Ubah
            </Button>
          </div>
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
        <p className="text-gray-600">Kelola preferensi aplikasi</p>
      </div>

      <div className="space-y-4">
        {/* Notification Settings */}
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Notifikasi</h3>
          <div className="space-y-4">
            {[
              {
                label: "Email notifikasi pesanan",
                desc: "Terima update pesanan via email",
              },
              {
                label: "Push notification",
                desc: "Notifikasi di browser/aplikasi",
              },
              {
                label: "Promo & penawaran",
                desc: "Info diskon dan promo terbaru",
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
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0057AB] peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="mb-4 font-semibold text-red-700">Zona Berbahaya</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Hapus Akun</p>
              <p className="text-sm text-gray-500">
                Hapus akun dan semua data secara permanen
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-100"
            >
              Hapus Akun
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-gray-500">
          © 2025 WisudaHub. All rights reserved
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-[#0057AB]">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-[#0057AB]">
            <TikTokIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN PAGE ============
function CustomerDashboardContent() {
  const router = useRouter();
  const toast = useToast();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");

  // Data state
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [notifications, setNotifications] = useState<NotificationDisplay[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // Map API booking to display format
  const mapBookingToDisplay = (booking: Booking): BookingDisplay => ({
    id: booking.id,
    serviceName: booking.service?.title || "Layanan",
    serviceImage: booking.service?.imageUrls?.[0] || "/placeholder.svg",
    vendorName: booking.vendor?.displayName || "Vendor",
    vendorAvatar: booking.vendor?.avatarUrl || "/placeholder.svg",
    eventDate: booking.eventDate,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    paymentMethod: null,
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt,
    notes: booking.notes || "",
    serviceId: booking.serviceId,
  });

  // Map API notification to display format
  const mapNotificationToDisplay = (
    notif: NotificationType
  ): NotificationDisplay => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    body: notif.body,
    read: notif.read,
    createdAt: notif.createdAt,
    metadata: notif.data || {},
  });

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoadingBookings(true);
        const data = await bookingsApi.getMyBookings();

        if (data && Array.isArray(data)) {
          setBookings(data.map(mapBookingToDisplay));
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoadingNotifications(true);
        const data = await notificationsApi.getAll();

        if (data && Array.isArray(data)) {
          setNotifications(data.map(mapNotificationToDisplay));
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("Semua notifikasi ditandai dibaca");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Gagal menandai notifikasi");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil keluar");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Gagal keluar");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return (
          <BookingsTab bookings={bookings} isLoading={isLoadingBookings} />
        );
      case "notifications":
        return (
          <NotificationsTab
            notifications={notifications}
            isLoading={isLoadingNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        );
      case "profile":
        return <ProfileTab bookings={bookings} />;
      case "settings":
        return <SettingsTab />;
      default:
        return (
          <BookingsTab bookings={bookings} isLoading={isLoadingBookings} />
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader unreadCount={unreadCount} />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
          onLogout={handleLogout}
        />

        <div className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8">{renderContent()}</div>
        </div>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}

// Wrap with CustomerRoute for authentication
export default function CustomerDashboardPage() {
  return (
    <CustomerRoute>
      <CustomerDashboardContent />
    </CustomerRoute>
  );
}
