"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Upload,
  CreditCard,
  Copy,
  Check,
  AlertCircle,
  Info,
  Shield,
  Loader2,
  FileImage,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ============ MOCK DATA ============
const mockBookingCheckout = {
  id: "BK-2024120001",
  service: {
    id: "s1",
    title: "Paket Foto Wisuda Premium ITB",
    imageUrl: "/Fotografer-wisuda.png",
    price: 850000,
    durationMinutes: 180,
    categoryName: "Fotografer",
  },
  vendor: {
    displayName: "Bandung Photo Studio",
    avatar: "/young-indonesian-man-portrait.jpg",
  },
  eventDate: "2025-07-15T08:00:00",
  location: "Kampus ITB Ganesha, Bandung",
  payment: {
    paymentReference: "PAY-2024120001",
    subtotal: 850000,
    serviceFee: 8500,
    total: 858500,
  },
};

const paymentMethods = [
  {
    id: "bca",
    name: "Bank BCA",
    type: "bank",
    accountNumber: "1234567890",
    accountHolder: "PT WisudaHub Indonesia",
    logo: "/bank-bca.png",
    instructions: [
      "Login ke BCA Mobile/KlikBCA",
      "Pilih Transfer > Ke Rekening BCA",
      "Masukkan nomor rekening tujuan",
      "Masukkan jumlah transfer sesuai total",
      "Masukkan kode referensi di berita transfer",
      "Konfirmasi dan selesaikan pembayaran",
    ],
  },
  {
    id: "mandiri",
    name: "Bank Mandiri",
    type: "bank",
    accountNumber: "0987654321",
    accountHolder: "PT WisudaHub Indonesia",
    logo: "/bank-mandiri.png",
    instructions: [
      "Login ke Livin' by Mandiri",
      "Pilih Transfer > Ke Rekening Mandiri",
      "Masukkan nomor rekening tujuan",
      "Masukkan jumlah transfer sesuai total",
      "Masukkan kode referensi di berita transfer",
      "Konfirmasi dan selesaikan pembayaran",
    ],
  },
  {
    id: "bni",
    name: "Bank BNI",
    type: "bank",
    accountNumber: "1122334455",
    accountHolder: "PT WisudaHub Indonesia",
    logo: "/bank-bni.png",
    instructions: [
      "Login ke BNI Mobile Banking",
      "Pilih Transfer > Antar Rekening BNI",
      "Masukkan nomor rekening tujuan",
      "Masukkan jumlah transfer sesuai total",
      "Masukkan kode referensi di keterangan",
      "Konfirmasi dan selesaikan pembayaran",
    ],
  },
  {
    id: "qris",
    name: "QRIS",
    type: "qris",
    logo: "/qris.png",
    instructions: [
      "Buka aplikasi e-wallet atau mobile banking",
      "Pilih menu Scan QR atau QRIS",
      "Scan QR Code yang ditampilkan",
      "Pastikan nominal sesuai",
      "Konfirmasi dan selesaikan pembayaran",
    ],
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

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  return `${hours} jam`;
}

// ============ COMPONENTS ============
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <Link
          href={`/booking/${mockBookingCheckout.id}`}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900">Pembayaran</h1>
          <p className="text-sm text-gray-500">#{mockBookingCheckout.id}</p>
        </div>
        <Link href="/">
          <Image src="/Logo.svg" alt="Wisudahub" width={100} height={28} />
        </Link>
      </div>
    </header>
  );
}

function OrderSummary() {
  const { service, vendor, eventDate, location, payment } = mockBookingCheckout;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Ringkasan Pesanan</h2>

      {/* Service Info */}
      <div className="flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <Badge className="mb-1 bg-pink-100 text-[#C0287F]">
            {service.categoryName}
          </Badge>
          <h3 className="font-semibold text-gray-900">{service.title}</h3>
          <p className="text-sm text-gray-500">{vendor.displayName}</p>
        </div>
      </div>

      {/* Schedule */}
      <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{formatDate(eventDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">
            {formatTime(eventDate)} ({formatDuration(service.durationMinutes)})
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{location}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mt-4 space-y-2 border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Harga Layanan</span>
          <span className="text-gray-900">{formatPrice(payment.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Biaya Platform (1%)</span>
          <span className="text-gray-900">
            {formatPrice(payment.serviceFee)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t pt-2">
          <span className="font-semibold text-gray-900">Total Pembayaran</span>
          <span className="text-xl font-bold text-[#C0287F]">
            {formatPrice(payment.total)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: {
  selectedMethod: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Metode Pembayaran</h2>

      <div className="space-y-3">
        {/* Bank Transfer */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">
            Transfer Bank
          </p>
          <div className="space-y-2">
            {paymentMethods
              .filter((m) => m.type === "bank")
              .map((method) => (
                <button
                  key={method.id}
                  onClick={() => onSelect(method.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    selectedMethod === method.id
                      ? "border-[#C0287F] bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-white">
                    <span className="text-sm font-bold text-blue-600">
                      {method.name.split(" ")[1]}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-500">Transfer Manual</p>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selectedMethod === method.id
                        ? "border-[#C0287F] bg-[#C0287F]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* E-Wallet/QRIS */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">
            E-Wallet & QRIS
          </p>
          <div className="space-y-2">
            {paymentMethods
              .filter((m) => m.type === "qris")
              .map((method) => (
                <button
                  key={method.id}
                  onClick={() => onSelect(method.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    selectedMethod === method.id
                      ? "border-[#C0287F] bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-blue-500">
                    <span className="text-sm font-bold text-white">QRIS</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-500">
                      Gopay, OVO, Dana, dll
                    </p>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selectedMethod === method.id
                        ? "border-[#C0287F] bg-[#C0287F]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentInstructions({ methodId }: { methodId: string }) {
  const method = paymentMethods.find((m) => m.id === methodId);
  const [copied, setCopied] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  if (!method) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">Detail Pembayaran</h2>

      {method.type === "bank" ? (
        <>
          {/* Bank Transfer Details */}
          <div className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <p className="mb-1 text-xs text-blue-600">Bank Tujuan</p>
              <p className="text-lg font-bold text-blue-900">{method.name}</p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="mb-1 text-xs text-gray-500">Nomor Rekening</p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-xl font-bold text-gray-900">
                  {method.accountNumber}
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(method.accountNumber!, "account")
                  }
                  className="rounded-lg bg-white p-2 shadow-sm hover:bg-gray-100"
                >
                  {copied === "account" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="mb-1 text-xs text-gray-500">Atas Nama</p>
              <p className="font-semibold text-gray-900">
                {method.accountHolder}
              </p>
            </div>

            <div className="rounded-xl border-2 border-[#C0287F] bg-pink-50 p-4">
              <p className="mb-1 text-xs text-[#C0287F]">Total Transfer</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0287F]">
                  {formatPrice(mockBookingCheckout.payment.total)}
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(
                      mockBookingCheckout.payment.total.toString(),
                      "amount"
                    )
                  }
                  className="rounded-lg bg-white p-2 shadow-sm hover:bg-pink-100"
                >
                  {copied === "amount" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-[#C0287F]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Reference Code */}
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-yellow-50 p-4">
            <AlertCircle className="h-6 w-6 flex-shrink-0 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Masukkan kode ini di berita transfer:
              </p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg font-bold text-yellow-900">
                  {mockBookingCheckout.payment.paymentReference}
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(
                      mockBookingCheckout.payment.paymentReference,
                      "ref"
                    )
                  }
                  className="rounded bg-yellow-100 p-1 hover:bg-yellow-200"
                >
                  {copied === "ref" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-yellow-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* QRIS */
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-blue-500">
                <span className="text-lg font-bold text-white">QR</span>
              </div>
              <p className="text-sm text-gray-500">
                QR Code akan muncul di sini
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-[#C0287F]">
            {formatPrice(mockBookingCheckout.payment.total)}
          </p>
          <p className="text-sm text-gray-500">
            Scan dengan aplikasi e-wallet atau mobile banking
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 border-t pt-4">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex w-full items-center justify-between"
        >
          <p className="font-medium text-gray-900">Cara Pembayaran</p>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform ${
              showInstructions ? "rotate-180" : ""
            }`}
          />
        </button>
        {showInstructions && (
          <ol className="mt-3 space-y-2">
            {method.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                  {index + 1}
                </span>
                <span className="text-gray-600">{instruction}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function UploadProof({
  uploadedFile,
  onUpload,
  onRemove,
}: {
  uploadedFile: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-900">
        Upload Bukti Pembayaran
      </h2>

      {uploadedFile ? (
        <div className="relative rounded-xl border bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <FileImage className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800">{uploadedFile.name}</p>
              <p className="text-sm text-green-600">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={onRemove}
              className="rounded-full bg-green-100 p-2 hover:bg-green-200"
            >
              <X className="h-4 w-4 text-green-600" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>File siap diupload</span>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-all hover:border-[#C0287F] hover:bg-pink-50">
          <div className="rounded-full bg-gray-200 p-4">
            <Upload className="h-8 w-8 text-gray-500" />
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-700">
              Klik untuk upload bukti transfer
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG atau PDF (max. 5MB)
            </p>
          </div>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3">
        <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />
        <p className="text-sm text-blue-700">
          Pastikan bukti transfer menampilkan tanggal, jumlah, dan nomor
          referensi dengan jelas.
        </p>
      </div>
    </div>
  );
}

function SecurityBadge() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 p-3">
      <Shield className="h-5 w-5 text-green-600" />
      <p className="text-sm text-gray-600">Transaksi aman & terenkripsi</p>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function CheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>("bca");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (!selectedMethod || !uploadedFile) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Bukti Pembayaran Terkirim!
          </h1>
          <p className="mb-6 text-gray-600">
            Pembayaran Anda sedang diverifikasi. Kami akan mengirim notifikasi
            setelah pembayaran dikonfirmasi oleh vendor.
          </p>
          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Nomor Pesanan</p>
            <p className="font-mono text-lg font-bold text-gray-900">
              {mockBookingCheckout.id}
            </p>
          </div>
          <div className="space-y-3">
            <Link href={`/booking/${mockBookingCheckout.id}`}>
              <Button className="w-full bg-[#C0287F] hover:bg-[#a02169]">
                Lihat Detail Pesanan
              </Button>
            </Link>
            <Link href="/dashboard/customer">
              <Button variant="outline" className="w-full">
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Left Column - Payment */}
          <div className="space-y-4 lg:col-span-3">
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onSelect={setSelectedMethod}
            />

            {selectedMethod && (
              <PaymentInstructions methodId={selectedMethod} />
            )}

            <UploadProof
              uploadedFile={uploadedFile}
              onUpload={setUploadedFile}
              onRemove={() => setUploadedFile(null)}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-4 lg:col-span-2">
            <OrderSummary />
            <SecurityBadge />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <div className="mx-auto max-w-4xl">
          <Button
            onClick={handleSubmit}
            disabled={!selectedMethod || !uploadedFile || isSubmitting}
            className="w-full gap-2 bg-[#C0287F] py-6 text-lg hover:bg-[#a02169] disabled:bg-gray-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Kirim Bukti Pembayaran
              </>
            )}
          </Button>
          {(!selectedMethod || !uploadedFile) && (
            <p className="mt-2 text-center text-sm text-gray-500">
              {!selectedMethod
                ? "Pilih metode pembayaran"
                : "Upload bukti pembayaran untuk melanjutkan"}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
