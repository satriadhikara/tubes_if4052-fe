"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Instagram,
  ArrowLeft,
  CheckCircle,
  Store,
  UserCircle,
  Camera,
  Sparkles,
  Flower2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { ApiError } from "@/lib/api/types";

// ============ ICONS ============
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// ============ TYPES ============
interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

// ============ COMPONENTS ============
function AuthHeader() {
  return (
    <header className="bg-[#0057AB] px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <Image src="/Logo.svg" alt="Wisudahub" width={130} height={36} />
        </div>
      </div>
    </header>
  );
}

function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/marketplace";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await login({ email, password });
      toast.success("Login berhasil! Selamat datang kembali.");

      // Redirect after successful login
      const redirect = searchParams.get("redirect") || "/marketplace";
      router.push(redirect);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const msg = (error.message || "").toLowerCase();
        if (error.statusCode === 401 || msg.includes("invalid")) {
          setErrors({ general: "Email atau password salah" });
        } else if (error.statusCode === 429) {
          setErrors({ general: "Terlalu banyak percobaan. Coba lagi nanti." });
        } else if (error.statusCode >= 500) {
          setErrors({
            general: "Server sedang bermasalah. Coba lagi beberapa saat.",
          });
        } else {
          setErrors({
            general: error.message || "Terjadi kesalahan saat login",
          });
        }
        toast.error(
          error.statusCode >= 500
            ? "Server bermasalah, coba lagi nanti."
            : error.message || "Login gagal",
        );
      } else {
        setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
        toast.error("Terjadi kesalahan saat login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Selamat Datang Kembali! 👋</h1>
        <p className="text-gray-600">Masuk ke akun WisudaHub kamu</p>
      </div>

      {/* Social Login */}
      <Button variant="outline" className="mb-6 w-full gap-3 py-6" type="button" disabled>
        <GoogleIcon className="h-5 w-5" />
        Lanjutkan dengan Google
        <span className="ml-2 text-xs text-gray-400">(Coming soon)</span>
      </Button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">atau</span>
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.general}</div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <button
              type="button"
              className="text-sm text-[#0057AB] hover:underline"
              onClick={() => toast.info("Fitur reset password akan segera hadir")}
            >
              Lupa password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#0057AB] py-6 text-lg font-semibold hover:bg-[#004080]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>

      {/* Switch to Register */}
      <p className="mt-6 text-center text-gray-600">
        Belum punya akun?{" "}
        <button
          onClick={onSwitchToRegister}
          className="font-semibold text-[#C0287F] hover:underline"
          disabled={isLoading}
        >
          Daftar sekarang
        </button>
      </p>
    </div>
  );
}

function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as "customer" | "vendor" | "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuth();
  const toast = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/marketplace";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleRoleSelect = (role: "customer" | "vendor") => {
    updateFormData("role", role);
    setStep(2);
  };

  const passwordRequirements = [
    { label: "Minimal 8 karakter", met: formData.password.length >= 8 },
    { label: "Huruf besar (A-Z)", met: /[A-Z]/.test(formData.password) },
    { label: "Huruf kecil (a-z)", met: /[a-z]/.test(formData.password) },
    { label: "Angka (0-9)", met: /[0-9]/.test(formData.password) },
  ];

  const allPasswordRequirementsMet = passwordRequirements.every((r) => r.met);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (!allPasswordRequirementsMet) {
      newErrors.password = "Password tidak memenuhi persyaratan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as "customer" | "vendor",
      });

      toast.success("Registrasi berhasil! Selamat bergabung di WisudaHub.");

      // Redirect after successful registration
      const redirect = searchParams.get("redirect");
      if (formData.role === "vendor") {
        router.push("/dashboard/vendor");
      } else if (redirect) {
        router.push(redirect);
      } else {
        router.push("/customer/dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          setErrors({ email: "Email sudah terdaftar" });
          toast.error("Email sudah terdaftar. Silakan gunakan email lain.");
        } else if (error.statusCode === 400) {
          setErrors({ general: error.message || "Data tidak valid" });
          toast.error(error.message || "Data tidak valid");
        } else {
          setErrors({
            general: error.message || "Terjadi kesalahan saat registrasi",
          });
          toast.error(error.message || "Registrasi gagal");
        }
      } else {
        setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
        toast.error("Terjadi kesalahan saat registrasi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Choose Role
  if (step === 1) {
    return (
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Bergabung dengan WisudaHub 🎓</h1>
          <p className="text-gray-600">Pilih jenis akun yang ingin kamu buat</p>
        </div>

        <div className="space-y-4">
          {/* Customer Option */}
          <button
            onClick={() => handleRoleSelect("customer")}
            className="group w-full rounded-2xl border-2 border-gray-200 p-6 text-left transition-all hover:border-[#0057AB] hover:bg-blue-50"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-[#0057AB] group-hover:bg-[#0057AB] group-hover:text-white">
                <UserCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  Saya Wisudawan / Pembeli
                </h3>
                <p className="text-sm text-gray-600">
                  Cari dan pesan jasa fotografer, MUA, bunga, dan hadiah untuk wisuda
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    <Camera className="h-3 w-3" /> Booking foto
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    <Sparkles className="h-3 w-3" /> Pesan MUA
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    <Flower2 className="h-3 w-3" /> Beli hadiah
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Vendor Option */}
          <button
            onClick={() => handleRoleSelect("vendor")}
            className="group w-full rounded-2xl border-2 border-gray-200 p-6 text-left transition-all hover:border-[#C0287F] hover:bg-pink-50"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-pink-100 p-3 text-[#C0287F] group-hover:bg-[#C0287F] group-hover:text-white">
                <Store className="h-8 w-8" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  Saya Vendor / Penyedia Jasa
                </h3>
                <p className="text-sm text-gray-600">
                  Tawarkan jasa fotografer, MUA, atau jualan bunga & hadiah wisuda
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3" /> Kelola layanan
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3" /> Terima booking
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3" /> Dapat income
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Switch to Login */}
        <p className="mt-8 text-center text-gray-600">
          Sudah punya akun?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-semibold text-[#0057AB] hover:underline"
          >
            Masuk di sini
          </button>
        </p>
      </div>
    );
  }

  // Step 2: Fill Form
  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => setStep(1)}
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali pilih jenis akun
        </button>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          {formData.role === "vendor" ? "Daftar sebagai Vendor 🏪" : "Daftar sebagai Customer 🎓"}
        </h1>
        <p className="text-gray-600">Lengkapi data diri kamu untuk mulai</p>
      </div>

      {/* Social Register */}
      <Button variant="outline" className="mb-6 w-full gap-3 py-6" type="button" disabled>
        <GoogleIcon className="h-5 w-5" />
        Daftar dengan Google
        <span className="ml-2 text-xs text-gray-400">(Coming soon)</span>
      </Button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">atau</span>
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.general}</div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
              className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}

          {/* Password Requirements */}
          <div className="mt-3 space-y-1">
            {passwordRequirements.map((req, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-xs ${
                  req.met ? "text-green-600" : "text-gray-400"
                }`}
              >
                <CheckCircle className={`h-3 w-3 ${req.met ? "fill-green-600" : ""}`} />
                {req.label}
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500">
          Dengan mendaftar, kamu menyetujui{" "}
          <a href="#" className="text-[#0057AB] hover:underline">
            Syarat & Ketentuan
          </a>{" "}
          dan{" "}
          <a href="#" className="text-[#0057AB] hover:underline">
            Kebijakan Privasi
          </a>{" "}
          WisudaHub.
        </p>

        <Button
          type="submit"
          className={`w-full py-6 text-lg font-semibold ${
            formData.role === "vendor"
              ? "bg-[#C0287F] hover:bg-[#a02169]"
              : "bg-[#0057AB] hover:bg-[#004080]"
          }`}
          disabled={isLoading || !allPasswordRequirementsMet}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </Button>
      </form>

      {/* Switch to Login */}
      <p className="mt-6 text-center text-gray-600">
        Sudah punya akun?{" "}
        <button
          onClick={onSwitchToLogin}
          className="font-semibold text-[#0057AB] hover:underline"
          disabled={isLoading}
        >
          Masuk di sini
        </button>
      </p>
    </div>
  );
}

function AuthIllustration() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0057AB] to-[#003d7a] p-12 lg:flex">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Rayakan Wisudamu,
          <br />
          <span className="text-[#EFA90D]">Gapake Ribet!</span>
        </h2>
        <p className="max-w-md text-lg text-white/80">
          Platform terlengkap untuk kebutuhan wisuda kamu. Dari fotografer, MUA, sampai bunga dan
          hadiah.
        </p>
      </div>

      {/* Features */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3 text-white">
          <div className="rounded-full bg-white/20 p-2">
            <Camera className="h-5 w-5" />
          </div>
          <span>Fotografer profesional berpengalaman</span>
        </div>
        <div className="flex items-center gap-3 text-white">
          <div className="rounded-full bg-white/20 p-2">
            <Sparkles className="h-5 w-5" />
          </div>
          <span>MUA terpercaya dan berkualitas</span>
        </div>
        <div className="flex items-center gap-3 text-white">
          <div className="rounded-full bg-white/20 p-2">
            <Flower2 className="h-5 w-5" />
          </div>
          <span>Bunga & hadiah untuk orang tersayang</span>
        </div>
      </div>

      {/* Decorative Image */}
      <div className="relative z-10 mt-8">
        <div className="relative h-48 w-full overflow-hidden rounded-2xl">
          <Image
            src="/Background-landing.jpg"
            alt="Wisuda"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0057AB] to-transparent" />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-gray-500">© 2025 WisudaHub. All rights reserved</p>
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 transition-colors hover:text-[#0057AB]">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 transition-colors hover:text-[#0057AB]">
            <TikTokIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ============ LOADING FALLBACK ============
function AuthLoading() {
  return (
    <main className="flex min-h-screen flex-col">
      <AuthHeader />
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0057AB] border-t-transparent" />
      </div>
    </main>
  );
}

// ============ MAIN PAGE CONTENT ============
function AuthPageContent() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const searchParams = useSearchParams();

  // Check for mode query param
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "register") {
      setMode("register");
    }
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col">
      <AuthHeader />

      <div className="flex flex-1">
        {/* Left Side - Illustration (Desktop) */}
        <div className="hidden w-1/2 lg:block">
          <AuthIllustration />
        </div>

        {/* Right Side - Form */}
        <div className="flex w-full flex-1 flex-col lg:w-1/2">
          <div className="flex flex-1 items-center justify-center px-4 py-12">
            {mode === "login" ? (
              <LoginForm onSwitchToRegister={() => setMode("register")} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode("login")} />
            )}
          </div>
          <Footer />
        </div>
      </div>
    </main>
  );
}

// ============ EXPORTED PAGE WITH SUSPENSE ============
export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthPageContent />
    </Suspense>
  );
}
