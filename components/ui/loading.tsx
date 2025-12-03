"use client";

import { cn } from "@/lib/utils";

// ============ Spinner ============

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-gray-200 border-t-[#C0287F]",
        sizes[size],
        className
      )}
    />
  );
}

// ============ Loading Overlay ============

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Memuat..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// ============ Page Loading ============

export function PageLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

// ============ Button Loading ============

interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function ButtonLoading({
  isLoading,
  children,
  loadingText = "Memproses...",
}: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <span className="flex items-center gap-2">
        <Spinner size="sm" />
        {loadingText}
      </span>
    );
  }
  return <>{children}</>;
}

// ============ Skeleton ============

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
}

// ============ Skeleton Card ============

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

// ============ Skeleton Service Grid ============

export function SkeletonServiceGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ============ Skeleton List Item ============

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}
