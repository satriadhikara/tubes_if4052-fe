// ============ API Response Types ============

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ Auth Types ============

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "vendor" | "admin";
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  totalBookings: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: "customer" | "vendor";
  phone?: string;
  // Vendor specific
  displayName?: string;
  bio?: string;
  location?: string;
}

export interface AuthResponse {
  user: User;
  vendor?: Vendor;
  token: string;
}

// ============ Category Types ============

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  serviceCount: number;
  createdAt: string;
}

// ============ Service Types ============

export interface Service {
  id: string;
  vendorId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  location: string;
  imageUrls: string[];
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
  // Joined data
  vendor?: Vendor;
  category?: Category;
}

export interface ServiceFilters {
  categoryId?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateServiceRequest {
  categoryId: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  location: string;
  imageUrls: string[];
  isFeatured?: boolean;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  isActive?: boolean;
}

// ============ Booking Types ============

export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  vendorId: string;
  eventDate: string;
  eventEndDate?: string;
  location: string;
  notes?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  paymentProofUrl?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
  // Joined data
  service?: Service;
  customer?: User;
  vendor?: Vendor;
}

export interface CreateBookingRequest {
  serviceId: string;
  eventDate: string;
  location?: string;
  notes?: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  reason?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
}

export interface UploadPaymentProofRequest {
  paymentProofUrl: string;
}

// ============ Testimonial/Review Types ============

export interface Testimonial {
  id: string;
  bookingId: string;
  serviceId: string;
  customerId: string;
  rating: number;
  comment: string;
  imageUrls?: string[];
  createdAt: string;
  // Joined data
  customer?: User;
  service?: Service;
}

export interface CreateTestimonialRequest {
  bookingId: string;
  rating: number;
  comment: string;
  imageUrls?: string[];
}

// ============ Notification Types ============

export type NotificationType =
  | "booking_created"
  | "booking_accepted"
  | "booking_rejected"
  | "booking_completed"
  | "booking_cancelled"
  | "payment_received"
  | "payment_confirmed"
  | "review_received"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

// ============ Home/Landing Types ============

export interface HomeData {
  featuredServices: Service[];
  categories: Category[];
  testimonials: Testimonial[];
  stats: {
    totalVendors: number;
    totalServices: number;
    totalBookings: number;
    averageRating: number;
  };
}

// ============ Vendor Dashboard Types ============

export interface VendorStats {
  totalServices: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  rating: number;
  reviewCount: number;
}

// ============ Error Types ============

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}
