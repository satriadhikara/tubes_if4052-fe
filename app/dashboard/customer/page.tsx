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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============ MOCK DATA ============
const mockUser = {
  id: "u1",
  name: "Sarah Putri",
  email: "sarah.putri@email.com",
  avatar: "/young-indonesian-woman-portrait.png",
  role: "customer",
  joinedDate: "Oktober 2024",
};

const mockBookings = [
  {
    id: "b1",
    serviceName: "Paket Foto Wisuda Premium ITB",
    serviceImage: "/Fotografer-wisuda.png",
    vendorName: "Bandung Photo Studio",
    vendorAvatar: "/young-indonesian-man-portrait.jpg",
    eventDate: "2025-07-15T08:00:00",
    status: "accepted",
    paymentStatus: "paid",
    paymentMethod: "qris",
    totalPrice: 850000,
    createdAt: "2024-12-01T10:00:00",
    notes: "Foto di area Aula Barat dan Taman Ganesha",
  },
  {
    id: "b2",
    serviceName: "Make Up Wisuda Natural Glam",
    serviceImage: "/MUA.png",
    vendorName: "Glow Beauty MUA",
    vendorAvatar: "/young-indonesian-woman-portrait.png",
    eventDate: "2025-07-15T06:00:00",
    status: "requested",
    paymentStatus: "pending",
    paymentMethod: "manual_transfer",
    totalPrice: 550000,
    createdAt: "2024-12-02T14:00:00",
    notes: "Makeup natural, tidak terlalu tebal",
  },
  {
    id: "b3",
    serviceName: "Bouquet Bunga Wisuda Elegant",
    serviceImage: "/Bunga.png",
    vendorName: "Flora Bandung",
    vendorAvatar: "/young-indonesian-man-smiling-portrait.jpg",
    eventDate: "2025-07-15T10:00:00",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "qris",
    totalPrice: 350000,
    createdAt: "2024-11-20T09:00:00",
    notes: "Warna pink dan putih",
  },
  {
    id: "b4",
    serviceName: "Paket Foto Candid Wisuda",
    serviceImage: "/Fotografer-wisuda.png",
    vendorName: "Moment Capture",
    vendorAvatar: "/young-indonesian-man-portrait.jpg",
    eventDate: "2024-10-20T08:00:00",
    status: "cancelled",
    paymentStatus: "failed",
    paymentMethod: null,
    totalPrice: 450000,
    createdAt: "2024-10-15T11:00:00",
    notes: "",
  },
];

const mockNotifications = [
  {
    id: "n1",
    type: "booking_status",
    title: "Booking Diterima! 🎉",
    body: "Booking Paket Foto Wisuda Premium ITB telah diterima oleh vendor.",
    read: false,
    createdAt: "2024-12-02T15:30:00",
    metadata: { bookingId: "b1", status: "accepted" },
  },
  {
    id: "n2",
    type: "payment_reminder",
    title: "Segera Selesaikan Pembayaran",
    body: "Booking Make Up Wisuda Natural Glam menunggu pembayaran. Batas waktu 24 jam.",
    read: false,
    createdAt: "2024-12-02T14:00:00",
    metadata: { bookingId: "b2" },
  },
  {
    id: "n3",
    type: "booking_completed",
    title: "Layanan Selesai ✅",
    body: "Bouquet Bunga Wisuda Elegant telah selesai. Jangan lupa beri ulasan!",
    read: true,
    createdAt: "2024-11-21T12:00:00",
    metadata: { bookingId: "b3" },
  },
  {
    id: "n4",
    type: "promo",
    title: "Promo Wisuda Juli! 🎓",
    body: "Dapatkan diskon 15% untuk semua layanan foto wisuda. Gunakan kode WISUDA15.",
    read: true,
    createdAt: "2024-11-15T09:00:00",
    metadata: {},
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
function DashboardHeader() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

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
              <AvatarImage src={mockUser.avatar} />
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {mockUser.name}
              </p>
              <p className="text-xs text-gray-500">Customer</p>
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
    { id: "bookings", label: "Pesanan Saya", icon: Package },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: Bell,
      badge: mockNotifications.filter((n) => !n.read).length,
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

function BookingsTab() {
  const [filter, setFilter] = useState("all");

  const filteredBookings =
    filter === "all"
      ? mockBookings
      : mockBookings.filter((b) => b.status === filter);

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
              Belum ada pesanan
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
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: (typeof mockBookings)[0] }) {
  const statusConfig = getStatusConfig(booking.status);
  const paymentConfig = getPaymentStatusConfig(booking.paymentStatus);

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>Booking #{booking.id.toUpperCase()}</span>
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
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
            <Image
              src={booking.serviceImage}
              alt={booking.serviceName}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="mb-1 font-semibold text-gray-900">
              {booking.serviceName}
            </h3>
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
          {booking.status === "requested" &&
            booking.paymentStatus === "pending" && (
              <Button
                size="sm"
                className="gap-2 bg-[#C0287F] hover:bg-[#a02169]"
              >
                <CreditCard className="h-4 w-4" />
                Bayar Sekarang
              </Button>
            )}
          {booking.paymentStatus === "pending" && (
            <Button size="sm" variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Bukti Bayar
            </Button>
          )}
          {booking.status === "completed" && (
            <Button size="sm" variant="outline" className="gap-2">
              <Star className="h-4 w-4" />
              Beri Ulasan
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat Vendor
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

function NotificationsTab() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      booking_status: <Package className="h-5 w-5 text-blue-500" />,
      payment_reminder: <AlertCircle className="h-5 w-5 text-orange-500" />,
      booking_completed: <CheckCircle className="h-5 w-5 text-green-500" />,
      promo: <Star className="h-5 w-5 text-yellow-500" />,
    };
    return icons[type] || <Bell className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
          <p className="text-gray-600">Update terbaru untuk pesananmu</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Tandai semua dibaca
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markAsRead(notif.id)}
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
    </div>
  );
}

function ProfileTab() {
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
              <AvatarImage src={mockUser.avatar} />
              <AvatarFallback className="text-2xl">
                {mockUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 rounded-full bg-[#0057AB] p-2 text-white shadow-lg hover:bg-[#004080]">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900">{mockUser.name}</h2>
            <p className="text-gray-500">{mockUser.email}</p>
            <p className="mt-1 text-sm text-gray-400">
              Bergabung sejak {mockUser.joinedDate}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Edit Profil
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 text-center">
          <Package className="mx-auto mb-2 h-8 w-8 text-[#0057AB]" />
          <p className="text-2xl font-bold text-gray-900">
            {mockBookings.length}
          </p>
          <p className="text-sm text-gray-500">Total Pesanan</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
          <p className="text-2xl font-bold text-gray-900">
            {mockBookings.filter((b) => b.status === "completed").length}
          </p>
          <p className="text-sm text-gray-500">Selesai</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Star className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
          <p className="text-2xl font-bold text-gray-900">3</p>
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
            <Input defaultValue={mockUser.name} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input defaultValue={mockUser.email} type="email" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <Input placeholder="+62 812-xxxx-xxxx" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Lokasi
            </label>
            <Input placeholder="Bandung" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button className="bg-[#0057AB] hover:bg-[#004080]">
            Simpan Perubahan
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
              <p className="text-sm text-gray-500">
                Terakhir diubah 3 bulan lalu
              </p>
            </div>
            <Button variant="outline" size="sm">
              Ubah
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium text-gray-900">Verifikasi 2 Langkah</p>
              <p className="text-sm text-gray-500">Belum diaktifkan</p>
            </div>
            <Button variant="outline" size="sm">
              Aktifkan
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
export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState("bookings");

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingsTab />;
      case "notifications":
        return <NotificationsTab />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <BookingsTab />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DashboardHeader />

      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8">{renderContent()}</div>
        </div>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
