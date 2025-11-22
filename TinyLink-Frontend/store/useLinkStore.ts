import { create } from 'zustand';
import type { Link, LinkWithAnalytics, Pagination } from '@/types';
import { linksApi } from '@/lib/api';

interface LinkState {
  links: Link[];
  currentLink: LinkWithAnalytics | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  limit: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  fetchLinks: () => Promise<void>;
  createLink: (data: {
    originalUrl: string;
    shortCode?: string;
    title?: string;
    description?: string;
    expiresAt?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  deleteLink: (code: string) => Promise<{ success: boolean; error?: string }>;
  fetchLinkByCode: (code: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  links: [],
  currentLink: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  limit: 10,
};

export const useLinkStore = create<LinkState>((set, get) => ({
  ...initialState,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().fetchLinks();
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().fetchLinks();
  },

  fetchLinks: async () => {
    set({ loading: true, error: null });
    try {
      const { currentPage, limit, searchQuery } = get();
      const response = await linksApi.getAll({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
      });

      if (response.success && response.data) {
        set({
          links: response.data.links,
          pagination: response.data.pagination,
          loading: false,
        });
      } else {
        set({ error: response.message || 'Failed to fetch links', loading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch links',
        loading: false,
      });
    }
  },

  createLink: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await linksApi.create(data);
      if (response.success) {
        await get().fetchLinks();
        return { success: true };
      } else {
        const error = response.message || 'Failed to create link';
        set({ error, loading: false });
        return { success: false, error };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create link';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  deleteLink: async (code: string) => {
    set({ loading: true, error: null });
    try {
      const response = await linksApi.delete(code);
      if (response.success) {
        await get().fetchLinks();
        return { success: true };
      } else {
        const error = response.message || 'Failed to delete link';
        set({ error, loading: false });
        return { success: false, error };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete link';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  fetchLinkByCode: async (code: string) => {
    set({ loading: true, error: null });
    try {
      const response = await linksApi.getByCode(code);
      if (response.success && response.data) {
        set({
          currentLink: response.data.link as LinkWithAnalytics,
          loading: false,
        });
      } else {
        set({
          error: response.message || 'Link not found',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch link',
        loading: false,
      });
    }
  },

  reset: () => {
    set(initialState);
  },
}));

