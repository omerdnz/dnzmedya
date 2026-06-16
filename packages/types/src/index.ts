export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  phone: string;
  phoneLink: string;
  email: string;
  address: string;
  copyright: string;
  social: Record<string, string>;
}

export interface HeroData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  videoUrl?: string;
  image?: MediaItem;
  animationType: string;
  counterValue?: number;
  counterLabel?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: MediaItem;
  image?: MediaItem;
  features?: string[];
  price?: number;
  isFeatured: boolean;
}

export interface PostItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: unknown;
  coverImage?: MediaItem;
  author: { firstName: string; lastName: string };
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  publishedAt?: string;
  viewCount: number;
}

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: MediaItem;
  schemaJson?: unknown;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  options?: string[];
}

export interface DashboardStats {
  visitors: number;
  forms: number;
  quotes: number;
  conversionRate: number;
  trafficSources: { source: string; count: number }[];
  serviceSales: { service: string; count: number }[];
}

export interface CustomerItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  number: string;
  title: string;
  status: string;
  total: number;
  customer: CustomerItem;
  validUntil?: string;
  createdAt: string;
}

export type Permission =
  | `${string}.create`
  | `${string}.read`
  | `${string}.update`
  | `${string}.delete`;
