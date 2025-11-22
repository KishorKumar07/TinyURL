import axios from 'axios';
import type {
  Link,
  LinkWithAnalytics,
  CreateLinkRequest,
  ApiResponse,
  LinksResponse,
  LinkResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const linksApi = {
  // Create a new link
  create: async (data: CreateLinkRequest): Promise<ApiResponse<LinkResponse>> => {
    const response = await api.post<ApiResponse<LinkResponse>>('/api/links', data);
    return response.data;
  },

  // Get all links with pagination and search
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<LinksResponse>> => {
    const response = await api.get<ApiResponse<LinksResponse>>('/api/links', { params });
    return response.data;
  },

  // Get link stats by code
  getByCode: async (code: string): Promise<ApiResponse<LinkResponse>> => {
    const response = await api.get<ApiResponse<LinkResponse>>(`/api/links/${code}`);
    return response.data;
  },

  // Delete a link by code
  delete: async (code: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/api/links/${code}`);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ ok: boolean; version: string }> => {
    const response = await api.get<{ ok: boolean; version: string }>('/healthz');
    return response.data;
  },
};

