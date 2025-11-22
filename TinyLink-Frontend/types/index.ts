export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  title?: string | null;
  description?: string | null;
  clicks: number;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  id: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  deviceType?: string | null;
  browser?: string | null;
  os?: string | null;
  clickedAt: string;
}

export interface LinkWithAnalytics extends Link {
  analytics: Analytics[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CreateLinkRequest {
  originalUrl: string;
  shortCode?: string;
  title?: string;
  description?: string;
  expiresAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LinksResponse {
  links: Link[];
  pagination: Pagination;
}

export interface LinkResponse {
  link: Link | LinkWithAnalytics;
}

