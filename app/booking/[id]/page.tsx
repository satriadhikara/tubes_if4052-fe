"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Download,
  Copy,
  ExternalLink,
  CreditCard,
  FileText,
  User,
  Store,
  Camera,
  Instagram,
  ChevronRight,
  Check,
  Circle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============ MOCK DATA ============
const mockBooking = {
  id: "BK-2024120001",
  status: "accepted",
  paymentStatus: "pending",
  createdAt: "2024-12-02T10:30:00",
  updatedAt: "2024-12-02T14:00:00",

  // Service Info
  service: {
    id: "s1",
    title: "Paket Foto Wisuda Premium ITB",
    description:
      "Paket lengkap foto wisuda dengan 3 jam pemotretan, 60 foto hasil edit profesional. Lokasi bisa di area kampus ITB dan sekitarnya seperti Taman Ganesha, Aula Barat, dan spot ikonik lainnya.",
    price: 850000,
    imageUrl: "/Fotografer-wisuda.png",
    durationMinutes: 180,
    categoryName: "Fotografer",
  },

  // Vendor Info
  vendor: {
    id: "v1",
    displayName: "Bandung Photo Studio",
    avatar: "/young-indonesian-man-portrait.jpg",
    phone: "+62 812-3456-7890",
    email: "bandungphoto@email.com",
    location: "Jl. Dago No. 123, Bandung",
    rating: 4.9,
    reviewCount: 128,
    instagram: "@bandungphotostudio",
  },

  // Customer Info
  customer: {
    id: "c1",
    name: "Sarah Putri Andini",
    email: "sarah.putri@email.com",
    phone: "+62 812-1111-2222",
    avatar: "/young-indonesian-woman-portrait.png",
  },

  // Booking Details
  eventDate: "2025-07-15T08:00:00",
  eventEndTime: "2025-07-15T11:00:00",
  location: "Kampus ITB Ganesha, Bandung",
  notes:
    "Foto di area Aula Barat dan Taman Ganesha. Akan hadir bersama keluarga (5 orang). Mohon bawa backdrop putih jika memungkinkan.",

  // Payment
  payment: {
    method: "Bank Transfer",
    bankName: "Bank BCA",
    accountNumber: "1234567890",
    accountHolder: "Bandung Photo Studio",
    amount: 850000,
    proofUrl: null,
    paidAt: null,
    paymentReference: "PAY-2024120001",
  },

  // Timeline
  timeline: [
    {
      status: "created",
      label: "Pesanan Dibuat",
      description: "Pesanan berhasil dibuat",
      timestamp: "2024-12-02T10:30:00",
      completed: true,
    },
    {
      status: "accepted",
      label: "Dikonfirmasi Vendor",
      description: "Vendor menerima pesanan Anda",
      timestamp: "2024-12-02T14:00:00",
      completed: true,
    },
    {
      status: "paid",
      label: "Pembayaran",
      description: "Menunggu pembayaran dari customer",
      timestamp: null,
      completed: false,
    },
    {
      status: "completed",
      label: "Selesai",
      description: "Layanan telah selesai dilakukan",
      timestamp: null,
      completed: false,
    },
  ],
};

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
    weekday: "long",
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

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
}

function getStatusConfig(status: string) {
  const configs: Record<
    string,
    { label: string; color: string; bgColor: string; icon: React.ReactNode }
  > = {
    requested: {
      label: "Menunggu Konfirmasi",
      color: "text-yellow-700",
      bgColor: "bg-yellow-100 border-yellow-200",
      icon: <Clock className="h-5 w-5" />,
    },
    accepted: {
      label: "Dikonfirmasi",
      color: "text-blue-700",
      bgColor: "bg-blue-100 border-blue-200",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    completed: {
      label: "Selesai",
      color: "text-green-700",
      bgColor: "bg-green-100 border-green-200",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    cancelled: {
      label: "Dibatalkan",
      color: "text-red-700",
      bgColor: "bg-red-100 border-red-200",
      icon: <XCircle className="h-5 w-5" />,
    },
  };
  return configs[status] || configs.requested;
}

function getPaymentStatusConfig(status: string) {
  const configs: Record<
    string,
    { label: string; color: string; bgColor: string }
  > = {
    pending: {
      label: "Belum Dibayar",
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
    paid: {
      label: "Lunas",
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    failed: {
      label: "Gagal",
      color: "text-red-700",
      bgColor: "bg-red-100",
    },
  };
  return configs[status] || configs.pending;
}

// ============ COMPONENTS ============
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <Link
          href="/dashboard/customer"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900">Detail Pesanan</h1>
          <p className="text-sm text-gray-500">#{mockBooking.id}</p>
        </div>
        <Link href="/">
          <Image src="/Logo.svg" alt="Wisudahub" width={100} height={28} />
        </Link>
      </div>
    </header>
  );
}

function StatusBanner() {
  const statusConfig = getStatusConfig(mockBooking.status);
  const paymentConfig = getPaymentStatusConfig(mockBooking.paymentStatus);

  return (
    <div className={`border ${statusConfig.bgColor} rounded-2xl p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full p-2 ${statusConfig.bgColor} ${statusConfig.color}`}
          >
            {statusConfig.icon}
          </div>
          <div>
            <p className={`font-semibold ${statusConfig.color}`}>
              {statusConfig.label}
            </p>
            <p className="text-sm text-gray-600">
              Terakhir diperbarui: {formatDateTime(mockBooking.updatedAt)}
            </p>
          </div>
        </div>
        <Badge className={`${paymentConfig.bgColor} ${paymentConfig.color}`}>
          {paymentConfig.label}
        </Badge>
      </div>
    </div>
  );
}

function ServiceCard() {
  const { service } = mockBooking;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Detail Layanan</h2>
      <div className="flex gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <Badge className="mb-2 bg-pink-100 text-[#C0287F]">
            {service.categoryName}
          </Badge>
          <h3 className="font-semibold text-gray-900">{service.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(service.durationMinutes)}</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">{service.description}</p>
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-gray-500">Harga Layanan</span>
        <span className="text-xl font-bold text-[#C0287F]">
          {formatPrice(service.price)}
        </span>
      </div>
    </div>
  );
}

function ScheduleCard() {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Jadwal & Lokasi</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Tanggal</p>
            <p className="text-gray-600">{formatDate(mockBooking.eventDate)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <Clock className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Waktu</p>
            <p className="text-gray-600">
              {formatTime(mockBooking.eventDate)} -{" "}
              {formatTime(mockBooking.eventEndTime)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-orange-100 p-2">
            <MapPin className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Lokasi</p>
            <p className="text-gray-600">{mockBooking.location}</p>
          </div>
        </div>
      </div>

      {mockBooking.notes && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="mb-1 text-sm font-medium text-gray-700">Catatan:</p>
          <p className="text-sm text-gray-600">{mockBooking.notes}</p>
        </div>
      )}
    </div>
  );
}

function VendorCard() {
  const { vendor } = mockBooking;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Vendor</h2>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={vendor.avatar} />
          <AvatarFallback>{vendor.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{vendor.displayName}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{vendor.rating}</span>
            <span className="text-gray-500">({vendor.reviewCount} ulasan)</span>
          </div>
          <p className="text-sm text-gray-500">{vendor.location}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-3 text-sm">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{vendor.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{vendor.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Instagram className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{vendor.instagram}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1 gap-2 bg-[#0057AB] hover:bg-[#004080]">
          <MessageCircle className="h-4 w-4" />
          Chat Vendor
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Phone className="h-4 w-4" />
          Hubungi
        </Button>
      </div>
    </div>
  );
}

function PaymentCard() {
  const { payment } = mockBooking;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Pembayaran</h2>

      {mockBooking.paymentStatus === "pending" ? (
        <>
          {/* Payment Instructions */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">
                {payment.method}
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">Bank</p>
                <p className="font-semibold text-gray-900">
                  {payment.bankName}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">Nomor Rekening</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg font-semibold text-gray-900">
                    {payment.accountNumber}
                  </p>
                  <button
                    onClick={() => copyToClipboard(payment.accountNumber)}
                    className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">Atas Nama</p>
                <p className="font-semibold text-gray-900">
                  {payment.accountHolder}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="text-2xl font-bold text-[#C0287F]">
                  {formatPrice(payment.amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Reference */}
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-3">
            <Info className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Gunakan kode referensi saat transfer:
              </p>
              <p className="font-mono font-semibold text-yellow-900">
                {payment.paymentReference}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(payment.paymentReference)}
              className="rounded-lg bg-yellow-100 p-2 hover:bg-yellow-200"
            >
              <Copy className="h-4 w-4 text-yellow-600" />
            </button>
          </div>

          {/* Upload Proof */}
          <div className="mt-4">
            <Link href={`/checkout/${mockBooking.id}`}>
              <Button className="w-full gap-2 bg-[#C0287F] hover:bg-[#a02169]">
                <Upload className="h-4 w-4" />
                Upload Bukti Pembayaran
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
          <p className="font-semibold text-green-800">Pembayaran Berhasil</p>
          <p className="text-sm text-green-600">
            Dibayar pada{" "}
            {formatDateTime(payment.paidAt || mockBooking.updatedAt)}
          </p>
        </div>
      )}
    </div>
  );
}

function TimelineCard() {
  const { timeline } = mockBooking;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Status Pesanan</h2>
      <div className="relative">
        {timeline.map((item, index) => (
          <div key={item.status} className="flex gap-4 pb-6 last:pb-0">
            {/* Line */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  item.completed
                    ? "bg-green-500 text-white"
                    : "border-2 border-gray-300 bg-white text-gray-300"
                }`}
              >
                {item.completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              {index < timeline.length - 1 && (
                <div
                  className={`w-0.5 flex-1 ${
                    item.completed && timeline[index + 1]?.completed
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-2">
              <p
                className={`font-medium ${
                  item.completed ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {item.label}
              </p>
              <p className="text-sm text-gray-500">{item.description}</p>
              {item.timestamp && (
                <p className="mt-1 text-xs text-gray-400">
                  {formatDateTime(item.timestamp)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
      <div className="mx-auto flex max-w-4xl gap-3">
        {mockBooking.status === "requested" && (
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            Batalkan Pesanan
          </Button>
        )}
        {mockBooking.status === "completed" && (
          <Button className="flex-1 gap-2 bg-[#EFA90D] text-black hover:bg-[#d99a0c]">
            <Star className="h-4 w-4" />
            Beri Ulasan
          </Button>
        )}
        <Button variant="outline" className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          Unduh Invoice
        </Button>
      </div>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function BookingDetailPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="space-y-4">
          <StatusBanner />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <ServiceCard />
              <ScheduleCard />
            </div>
            <div className="space-y-4">
              <PaymentCard />
              <VendorCard />
            </div>
          </div>

          <TimelineCard />

          <div className="hidden md:block">
            <ActionButtons />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <ActionButtons />
      </div>
    </main>
  );
}
