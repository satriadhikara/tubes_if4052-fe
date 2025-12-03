"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============ Error Display ============

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

export function ErrorDisplay({
  title = "Terjadi Kesalahan",
  message = "Maaf, terjadi kesalahan saat memuat data. Silakan coba lagi.",
  onRetry,
  showHomeButton = false,
  showBackButton = false,
}: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mb-6 max-w-md text-gray-600">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="gap-2 bg-[#C0287F] hover:bg-[#a02169]"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
        )}
        {showBackButton && (
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        )}
        {showHomeButton && (
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Ke Beranda
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

// ============ Empty State ============

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-4 text-center">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-gray-600">{description}</p>
      )}
      {action &&
        (action.href ? (
          <Link href={action.href}>
            <Button className="bg-[#C0287F] hover:bg-[#a02169]">
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button
            onClick={action.onClick}
            className="bg-[#C0287F] hover:bg-[#a02169]"
          >
            {action.label}
          </Button>
        ))}
    </div>
  );
}

// ============ Offline Banner ============

export function OfflineBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-black">
      Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
    </div>
  );
}

// ============ Network Error ============

interface NetworkErrorProps {
  onRetry?: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <ErrorDisplay
      title="Koneksi Bermasalah"
      message="Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
      onRetry={onRetry}
      showHomeButton
    />
  );
}

// ============ Unauthorized Error ============

export function UnauthorizedError() {
  return (
    <ErrorDisplay
      title="Akses Ditolak"
      message="Anda tidak memiliki akses ke halaman ini. Silakan login terlebih dahulu."
      showHomeButton
    />
  );
}

// ============ Not Found Error ============

interface NotFoundErrorProps {
  resource?: string;
}

export function NotFoundError({ resource = "Halaman" }: NotFoundErrorProps) {
  return (
    <ErrorDisplay
      title={`${resource} Tidak Ditemukan`}
      message={`${resource} yang Anda cari tidak ditemukan atau sudah dihapus.`}
      showHomeButton
      showBackButton
    />
  );
}
