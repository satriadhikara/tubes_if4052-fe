"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Clock,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Save,
  Eye,
  Trash2,
  GripVertical,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ============ MOCK DATA ============
const mockCategories = [
  { id: "cat1", name: "Fotografer", icon: "📷" },
  { id: "cat2", name: "Makeup Artist", icon: "💄" },
  { id: "cat3", name: "Bunga & Gift", icon: "💐" },
  { id: "cat4", name: "Videografer", icon: "🎥" },
  { id: "cat5", name: "Dekorasi", icon: "🎨" },
  { id: "cat6", name: "Catering", icon: "🍽️" },
];

const mockLocations = [
  "Bandung",
  "Jakarta",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Malang",
  "Bogor",
  "Depok",
];

// Default empty service for create mode
const emptyService = {
  id: "",
  title: "",
  description: "",
  price: 0,
  durationMinutes: 60,
  categoryId: "",
  location: "",
  images: [] as string[],
  isFeatured: false,
  includes: [""],
  excludes: [""],
};

// Mock existing service for edit mode (uncomment to test edit)
// const existingService = {
//   id: "s1",
//   title: "Paket Foto Wisuda Premium ITB",
//   description: "Paket lengkap foto wisuda dengan 3 jam pemotretan...",
//   price: 850000,
//   durationMinutes: 180,
//   categoryId: "cat1",
//   location: "Bandung",
//   images: ["/Fotografer-wisuda.png", "/Fotografer-wisuda.png"],
//   isFeatured: true,
//   includes: ["60 foto edit", "3 jam pemotretan", "Softcopy via Google Drive"],
//   excludes: ["Cetak foto", "Album"],
// };

// ============ HELPER FUNCTIONS ============
function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// ============ COMPONENTS ============
function Header({ isEdit }: { isEdit: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <Link
          href="/dashboard/vendor"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900">
            {isEdit ? "Edit Layanan" : "Tambah Layanan Baru"}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit
              ? "Perbarui informasi layanan"
              : "Buat layanan baru untuk ditawarkan"}
          </p>
        </div>
        <Link href="/">
          <Image src="/Logo.svg" alt="Wisudahub" width={100} height={28} />
        </Link>
      </div>
    </header>
  );
}

function ImageUploader({
  images,
  onImagesChange,
}: {
  images: string[];
  onImagesChange: (images: string[]) => void;
}) {
  const handleAddImage = () => {
    // In real app, this would open file picker
    // For mock, we add a placeholder
    onImagesChange([...images, "/Fotografer-wisuda.png"]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-gray-500" />
        <h2 className="font-semibold text-gray-900">Foto Layanan</h2>
        <Badge variant="outline" className="ml-auto">
          {images.length}/5 foto
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-xl border"
          >
            <Image
              src={image}
              alt={`Service image ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="rounded-full bg-white p-2 hover:bg-gray-100">
                <GripVertical className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleRemoveImage(index)}
                className="rounded-full bg-red-500 p-2 hover:bg-red-600"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            {index === 0 && (
              <Badge className="absolute left-2 top-2 bg-[#C0287F]">
                Utama
              </Badge>
            )}
          </div>
        ))}

        {images.length < 5 && (
          <button
            onClick={handleAddImage}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-all hover:border-[#C0287F] hover:bg-pink-50 hover:text-[#C0287F]"
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm font-medium">Tambah Foto</span>
          </button>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Upload minimal 1 foto, maksimal 5 foto. Foto pertama akan menjadi foto
        utama. Format: JPG, PNG (max 5MB)
      </p>
    </div>
  );
}

function BasicInfoForm({
  formData,
  onChange,
}: {
  formData: typeof emptyService;
  onChange: (data: Partial<typeof emptyService>) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-gray-500" />
        <h2 className="font-semibold text-gray-900">Informasi Dasar</h2>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nama Layanan <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Contoh: Paket Foto Wisuda Premium ITB"
            className="h-12"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/100 karakter
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Kategori <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange({ categoryId: cat.id })}
                className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all ${
                  formData.categoryId === cat.id
                    ? "border-[#C0287F] bg-pink-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Deskripsi Layanan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Jelaskan detail layanan Anda, apa yang customer dapatkan, keunggulan, dll..."
            rows={5}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#C0287F] focus:outline-none focus:ring-1 focus:ring-[#C0287F]"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/1000 karakter
          </p>
        </div>
      </div>
    </div>
  );
}

function PricingForm({
  formData,
  onChange,
}: {
  formData: typeof emptyService;
  onChange: (data: Partial<typeof emptyService>) => void;
}) {
  const durationOptions = [
    { value: 30, label: "30 menit" },
    { value: 60, label: "1 jam" },
    { value: 90, label: "1.5 jam" },
    { value: 120, label: "2 jam" },
    { value: 180, label: "3 jam" },
    { value: 240, label: "4 jam" },
    { value: 300, label: "5 jam" },
    { value: 360, label: "6 jam" },
    { value: 480, label: "8 jam (Full Day)" },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-gray-500" />
        <h2 className="font-semibold text-gray-900">Harga & Durasi</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Harga Layanan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              Rp
            </span>
            <Input
              type="number"
              value={formData.price || ""}
              onChange={(e) =>
                onChange({ price: parseInt(e.target.value) || 0 })
              }
              placeholder="850000"
              className="h-12 pl-12"
            />
          </div>
          {formData.price > 0 && (
            <p className="mt-1 text-sm text-[#C0287F]">
              {formatPrice(formData.price)}
            </p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Durasi Layanan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.durationMinutes}
              onChange={(e) =>
                onChange({ durationMinutes: parseInt(e.target.value) })
              }
              className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm focus:border-[#C0287F] focus:outline-none focus:ring-1 focus:ring-[#C0287F]"
            >
              {durationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Location */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Lokasi Layanan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              value={formData.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm focus:border-[#C0287F] focus:outline-none focus:ring-1 focus:ring-[#C0287F]"
            >
              <option value="">Pilih lokasi</option>
              {mockLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IncludesExcludesForm({
  formData,
  onChange,
}: {
  formData: typeof emptyService;
  onChange: (data: Partial<typeof emptyService>) => void;
}) {
  const handleAddInclude = () => {
    onChange({ includes: [...formData.includes, ""] });
  };

  const handleRemoveInclude = (index: number) => {
    const newIncludes = formData.includes.filter((_, i) => i !== index);
    onChange({ includes: newIncludes.length > 0 ? newIncludes : [""] });
  };

  const handleIncludeChange = (index: number, value: string) => {
    const newIncludes = [...formData.includes];
    newIncludes[index] = value;
    onChange({ includes: newIncludes });
  };

  const handleAddExclude = () => {
    onChange({ excludes: [...formData.excludes, ""] });
  };

  const handleRemoveExclude = (index: number) => {
    const newExcludes = formData.excludes.filter((_, i) => i !== index);
    onChange({ excludes: newExcludes.length > 0 ? newExcludes : [""] });
  };

  const handleExcludeChange = (index: number, value: string) => {
    const newExcludes = [...formData.excludes];
    newExcludes[index] = value;
    onChange({ excludes: newExcludes });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-gray-500" />
        <h2 className="font-semibold text-gray-900">
          Yang Termasuk & Tidak Termasuk
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Includes */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle className="h-4 w-4" />
            Yang Termasuk
          </label>
          <div className="space-y-2">
            {formData.includes.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleIncludeChange(index, e.target.value)}
                  placeholder="Contoh: 60 foto edit"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInclude(index)}
                  className="rounded-lg border p-2 text-gray-400 hover:bg-gray-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddInclude}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-green-200 py-2 text-sm text-green-600 hover:border-green-300 hover:bg-green-50"
            >
              <Plus className="h-4 w-4" />
              Tambah Item
            </button>
          </div>
        </div>

        {/* Excludes */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-red-700">
            <X className="h-4 w-4" />
            Yang Tidak Termasuk
          </label>
          <div className="space-y-2">
            {formData.excludes.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleExcludeChange(index, e.target.value)}
                  placeholder="Contoh: Cetak foto"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExclude(index)}
                  className="rounded-lg border p-2 text-gray-400 hover:bg-gray-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddExclude}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-red-200 py-2 text-sm text-red-600 hover:border-red-300 hover:bg-red-50"
            >
              <Plus className="h-4 w-4" />
              Tambah Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedToggle({
  isFeatured,
  onChange,
}: {
  isFeatured: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-yellow-100 p-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Layanan Unggulan</p>
            <p className="text-sm text-gray-500">
              Tampilkan layanan ini di halaman utama marketplace
            </p>
          </div>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => onChange(e.target.checked)}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#EFA90D] peer-checked:after:translate-x-full" />
        </label>
      </div>
    </div>
  );
}

function FormValidation({ formData }: { formData: typeof emptyService }) {
  const errors: string[] = [];

  if (!formData.title) errors.push("Nama layanan wajib diisi");
  if (!formData.categoryId) errors.push("Pilih kategori layanan");
  if (!formData.description) errors.push("Deskripsi layanan wajib diisi");
  if (!formData.price || formData.price <= 0)
    errors.push("Masukkan harga layanan");
  if (!formData.location) errors.push("Pilih lokasi layanan");
  if (formData.images.length === 0)
    errors.push("Upload minimal 1 foto layanan");

  if (errors.length === 0) return null;

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-500" />
        <div>
          <p className="font-medium text-orange-800">Lengkapi data berikut:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-orange-700">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function CreateServicePage() {
  const isEdit = false; // Change to true for edit mode
  const [formData, setFormData] = useState(emptyService);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (data: Partial<typeof emptyService>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const isFormValid =
    formData.title &&
    formData.categoryId &&
    formData.description &&
    formData.price > 0 &&
    formData.location &&
    formData.images.length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Layanan Berhasil {isEdit ? "Diperbarui" : "Dibuat"}!
          </h1>
          <p className="mb-6 text-gray-600">
            Layanan Anda sudah {isEdit ? "diperbarui" : "ditambahkan"} dan dapat
            dilihat oleh customer di marketplace.
          </p>
          <div className="space-y-3">
            <Link href="/dashboard/vendor">
              <Button className="w-full bg-[#C0287F] hover:bg-[#a02169]">
                Kembali ke Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowSuccess(false);
                setFormData(emptyService);
              }}
            >
              Tambah Layanan Lagi
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Header isEdit={isEdit} />

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="space-y-4">
          <ImageUploader
            images={formData.images}
            onImagesChange={(images) => handleChange({ images })}
          />

          <BasicInfoForm formData={formData} onChange={handleChange} />

          <PricingForm formData={formData} onChange={handleChange} />

          <IncludesExcludesForm formData={formData} onChange={handleChange} />

          <FeaturedToggle
            isFeatured={formData.isFeatured}
            onChange={(isFeatured) => handleChange({ isFeatured })}
          />

          <FormValidation formData={formData} />
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <div className="mx-auto flex max-w-3xl gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Simpan Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="flex-1 gap-2 bg-[#C0287F] hover:bg-[#a02169] disabled:bg-gray-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                {isEdit ? "Perbarui Layanan" : "Publikasikan"}
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
