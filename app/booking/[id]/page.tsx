"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bookingsApi, testimonialsApi } from "@/lib/api";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/api/types";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { CustomerRoute } from "@/components/auth/protected-route";

// ============ TYPES ============
interface TimelineItem {
  status: string;
  label: string;
  description: string;
  timestamp: string | null;
  completed: boolean;
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
function Header({ booking }: { booking: Booking }) {
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
          <p className="text-sm text-gray-500">
            #{booking.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <Link href="/">
          <Image src="/Logo.svg" alt="Wisudahub" width={100} height={28} />
        </Link>
      </div>
    </header>
  );
}

function StatusBanner({ booking }: { booking: Booking }) {
  const statusConfig = getStatusConfig(booking.status);
  const paymentConfig = getPaymentStatusConfig(booking.paymentStatus);

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
              Terakhir diperbarui: {formatDateTime(booking.updatedAt)}
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

function ServiceCard({ booking }: { booking: Booking }) {
  const service = booking.service;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Detail Layanan</h2>
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {service?.imageUrls?.[0] ? (
            <Image
              src={service.imageUrls[0]}
              alt={service?.title || "Service"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Camera className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Badge className="mb-2 bg-pink-100 text-[#C0287F]">
            {service?.category?.name || "Layanan"}
          </Badge>
          <h3 className="font-semibold text-gray-900">
            {service?.title || "Layanan"}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(service?.durationMinutes || 60)}</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">{service?.description || ""}</p>
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-gray-500">Harga Layanan</span>
        <span className="text-xl font-bold text-[#C0287F]">
          {formatPrice(booking.totalPrice)}
        </span>
      </div>
    </div>
  );
}

function ScheduleCard({ booking }: { booking: Booking }) {
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
            <p className="text-gray-600">{formatDate(booking.eventDate)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <Clock className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Waktu</p>
            <p className="text-gray-600">
              {formatTime(booking.eventDate)}
              {booking.eventEndDate && ` - ${formatTime(booking.eventEndDate)}`}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-orange-100 p-2">
            <MapPin className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Lokasi</p>
            <p className="text-gray-600">{booking.location}</p>
          </div>
        </div>
      </div>

      {booking.notes && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="mb-1 text-sm font-medium text-gray-700">Catatan:</p>
          <p className="text-sm text-gray-600">{booking.notes}</p>
        </div>
      )}
    </div>
  );
}

function VendorCard({ booking }: { booking: Booking }) {
  const vendor = booking.vendor;

  if (!vendor) {
    return (
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">Vendor</h2>
        <p className="text-gray-500">Informasi vendor tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Vendor</h2>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={vendor.avatarUrl} />
          <AvatarFallback>{vendor.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{vendor.displayName}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {vendor.rating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-gray-500">
              ({vendor.reviewCount || 0} ulasan)
            </span>
          </div>
          {vendor.location && (
            <p className="text-sm text-gray-500">{vendor.location}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/vendor/${vendor.id}`} className="flex-1">
          <Button className="w-full gap-2 bg-[#0057AB] hover:bg-[#004080]">
            <Store className="h-4 w-4" />
            Lihat Profil
          </Button>
        </Link>
        <Button variant="outline" className="flex-1 gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </div>
    </div>
  );
}

function PaymentCard({ booking }: { booking: Booking }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Pembayaran</h2>

      {booking.paymentStatus === "pending" ? (
        <>
          {/* Payment Instructions */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Bank Transfer</span>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">Bank</p>
                <p className="font-semibold text-gray-900">Bank BCA</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">Nomor Rekening</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg font-semibold text-gray-900">
                    1234567890
                  </p>
                  <button
                    onClick={() => copyToClipboard("1234567890")}
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
                  {booking.vendor?.displayName || "WisudaHub"}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="text-2xl font-bold text-[#C0287F]">
                  {formatPrice(booking.totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Reference */}
          {booking.paymentReference && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-3">
              <Info className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Gunakan kode referensi saat transfer:
                </p>
                <p className="font-mono font-semibold text-yellow-900">
                  {booking.paymentReference}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(booking.paymentReference || "")}
                className="rounded-lg bg-yellow-100 p-2 hover:bg-yellow-200"
              >
                <Copy className="h-4 w-4 text-yellow-600" />
              </button>
            </div>
          )}

          {/* Upload Proof */}
          <div className="mt-4">
            <Link href={`/checkout/${booking.id}`}>
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
            Dibayar pada {formatDateTime(booking.updatedAt)}
          </p>
          {booking.paymentProofUrl && (
            <a
              href={booking.paymentProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-green-700 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Lihat Bukti Pembayaran
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function generateTimeline(booking: Booking): TimelineItem[] {
  const timeline: TimelineItem[] = [
    {
      status: "created",
      label: "Pesanan Dibuat",
      description: "Pesanan berhasil dibuat",
      timestamp: booking.createdAt,
      completed: true,
    },
  ];

  // Add accepted/rejected step
  if (booking.status === "accepted" || booking.status === "completed") {
    timeline.push({
      status: "accepted",
      label: "Dikonfirmasi Vendor",
      description: "Vendor menerima pesanan Anda",
      timestamp: booking.updatedAt,
      completed: true,
    });
  } else if (booking.status === "rejected") {
    timeline.push({
      status: "rejected",
      label: "Ditolak Vendor",
      description: "Vendor menolak pesanan",
      timestamp: booking.updatedAt,
      completed: true,
    });
  } else if (booking.status === "cancelled") {
    timeline.push({
      status: "cancelled",
      label: "Dibatalkan",
      description: "Pesanan dibatalkan",
      timestamp: booking.updatedAt,
      completed: true,
    });
  } else {
    timeline.push({
      status: "accepted",
      label: "Konfirmasi Vendor",
      description: "Menunggu konfirmasi vendor",
      timestamp: null,
      completed: false,
    });
  }

  // Add payment step
  if (booking.paymentStatus === "paid") {
    timeline.push({
      status: "paid",
      label: "Pembayaran",
      description: "Pembayaran berhasil diterima",
      timestamp: booking.updatedAt,
      completed: true,
    });
  } else if (booking.status !== "rejected" && booking.status !== "cancelled") {
    timeline.push({
      status: "paid",
      label: "Pembayaran",
      description: "Menunggu pembayaran",
      timestamp: null,
      completed: false,
    });
  }

  // Add completed step
  if (booking.status === "completed") {
    timeline.push({
      status: "completed",
      label: "Selesai",
      description: "Layanan telah selesai dilakukan",
      timestamp: booking.updatedAt,
      completed: true,
    });
  } else if (booking.status !== "rejected" && booking.status !== "cancelled") {
    timeline.push({
      status: "completed",
      label: "Selesai",
      description: "Layanan belum selesai",
      timestamp: null,
      completed: false,
    });
  }

  return timeline;
}

function TimelineCard({ booking }: { booking: Booking }) {
  const timeline = generateTimeline(booking);

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

function ActionButtons({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: () => void;
}) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
      <div className="mx-auto flex max-w-4xl gap-3">
        {booking.status === "requested" && (
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            onClick={onCancel}
          >
            Batalkan Pesanan
          </Button>
        )}
        {booking.status === "completed" && booking.paymentStatus === "paid" && (
          <Button
            className="flex-1 gap-2 bg-[#EFA90D] text-black hover:bg-[#d99a0c]"
            onClick={() =>
              router.push(`/service/${booking.serviceId}?review=true`)
            }
          >
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
function BookingDetailContent() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const bookingId = params.id as string;

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bookingData = await bookingsApi.getById(bookingId);
        if (bookingData) {
          setBooking(bookingData);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Gagal memuat data pesanan");
        toast.error("Gagal memuat data pesanan");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, toast]);

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      return;
    }

    try {
      setIsCancelling(true);
      await bookingsApi.updateStatus(booking.id, { status: "cancelled" });
      toast.success("Pesanan berhasil dibatalkan");
      // Refresh booking data
      const bookingData = await bookingsApi.getById(bookingId);
      if (bookingData) {
        setBooking(bookingData);
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error("Gagal membatalkan pesanan");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#C0287F]" />
          <p className="mt-4 text-gray-600">Memuat data pesanan...</p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-gray-600">
            {error || "Pesanan tidak ditemukan"}
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/customer")}
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <Header booking={booking} />

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="space-y-4">
          <StatusBanner booking={booking} />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <ServiceCard booking={booking} />
              <ScheduleCard booking={booking} />
            </div>
            <div className="space-y-4">
              <PaymentCard booking={booking} />
              <VendorCard booking={booking} />
            </div>
          </div>

          <TimelineCard booking={booking} />

          <div className="hidden md:block">
            <ActionButtons booking={booking} onCancel={handleCancelBooking} />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <ActionButtons booking={booking} onCancel={handleCancelBooking} />
      </div>
    </main>
  );
}

export default function BookingDetailPage() {
  return (
    <CustomerRoute>
      <BookingDetailContent />
    </CustomerRoute>
  );
}
