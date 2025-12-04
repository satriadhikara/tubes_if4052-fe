import api from "./client";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Vendor,
  Category,
  Service,
  ServiceFilters,
  CreateServiceRequest,
  UpdateServiceRequest,
  Booking,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  UpdatePaymentStatusRequest,
  Testimonial,
  CreateTestimonialRequest,
  Notification,
  HomeData,
  VendorStats,
  PaginatedResponse,
} from "./types";

// ============ Auth API ============

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data),

  login: (data: LoginRequest) => api.post<AuthResponse>("/auth/login", data),

  logout: () => api.post<void>("/auth/logout"),

  // Backend returns the public user object directly under data
  me: () => api.get<User>("/auth/me"),

  refreshToken: () => api.post<{ token: string }>("/auth/refresh"),
};

// ============ Users API ============

export const usersApi = {
  getById: (id: string) => api.get<User>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data),

  delete: (id: string) => api.delete<void>(`/users/${id}`),

  updateAvatar: (id: string, avatarUrl: string) =>
    api.patch<User>(`/users/${id}`, { avatarUrl }),
};

// ============ Categories API ============

export const categoriesApi = {
  getAll: () => api.get<Category[]>("/categories"),

  getById: (id: string) => api.get<Category>(`/categories/${id}`),
};

// ============ Services API ============

export const servicesApi = {
  getAll: (filters?: ServiceFilters) =>
    api.get<Service[]>(
      "/services",
      filters as Record<string, string | number | boolean | undefined>
    ),

  getById: (id: string) => api.get<Service>(`/services/${id}`),

  getMine: () => api.get<Service[]>("/services/mine"),

  getByVendor: (vendorId: string) =>
    api.get<Service[]>(`/services`, { vendorId }),

  create: (data: CreateServiceRequest) => api.post<Service>("/services", data),

  update: (id: string, data: UpdateServiceRequest) =>
    api.put<Service>(`/services/${id}`, data),

  delete: (id: string) => api.delete<void>(`/services/${id}`),

  getFeatured: () =>
    api.get<Service[]>("/services", { isFeatured: true, limit: 8 }),
};

// ============ Bookings API ============

export const bookingsApi = {
  // Customer
  create: (data: CreateBookingRequest) => api.post<Booking>("/bookings", data),

  getMyBookings: (status?: string) =>
    api.get<Booking[]>("/bookings/me", status ? { status } : undefined),

  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),

  cancel: (id: string, reason?: string) =>
    api.patch<Booking>(`/bookings/${id}/status`, {
      status: "cancelled",
      reason,
    }),

  uploadPaymentProof: (id: string, paymentProofUrl: string) =>
    api.patch<Booking>(`/bookings/${id}/payment-proof`, { paymentProofUrl }),

  // Vendor
  getVendorBookings: (status?: string) =>
    api.get<Booking[]>("/bookings/vendor", status ? { status } : undefined),

  updateStatus: (id: string, data: UpdateBookingStatusRequest) =>
    api.patch<Booking>(`/bookings/${id}/status`, data),

  updatePaymentStatus: (id: string, data: UpdatePaymentStatusRequest) =>
    api.patch<Booking>(`/bookings/${id}/payment-status`, data),

  // Payment
  createPaymentIntent: (
    id: string,
    data: { paymentMethod: "manual_transfer" | "qris" }
  ) => api.post(`/bookings/${id}/payment-intent`, data),
};

// ============ Testimonials API ============

export const testimonialsApi = {
  getAll: (serviceId?: string) =>
    api.get<Testimonial[]>(
      "/testimonials",
      serviceId ? { serviceId } : undefined
    ),

  getByService: (serviceId: string) =>
    api.get<Testimonial[]>(`/testimonials`, { serviceId }),

  getByVendor: (vendorId: string) =>
    api.get<Testimonial[]>(`/testimonials`, { vendorId }),

  create: (data: CreateTestimonialRequest) =>
    api.post<Testimonial>("/testimonials", data),
};

// ============ Notifications API ============

export const notificationsApi = {
  getAll: () => api.get<Notification[]>("/notifications"),

  markAsRead: (id: string) =>
    api.patch<Notification>(`/notifications/${id}/read`),

  markAllAsRead: () => api.patch<void>("/notifications/read-all"),

  getUnreadCount: () =>
    api.get<{ count: number }>("/notifications/unread-count"),
};

// ============ Vendors API ============

export const vendorsApi = {
  getMe: () => api.get<Vendor>("/vendors/me"),

  getById: (id: string) =>
    api.get<{
      vendor: Vendor;
      services: Service[];
      testimonials: Testimonial[];
    }>(`/vendors/${id}`),

  update: (data: Partial<Vendor>) => api.put<Vendor>("/vendors/me", data),

  getStats: () => api.get<VendorStats>("/vendors/me/stats"),
};

// ============ Home API ============

export const homeApi = {
  getData: () => api.get<HomeData>("/home"),
};

// ============ Export All ============

export * from "./types";
export { api, tokenStorage, uploadFile } from "./client";
