'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useLinkStore } from '@/store/useLinkStore';
import { LinkTable } from '@/components/links/LinkTable';
import { CreateLinkForm } from '@/components/forms/CreateLinkForm';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkeletonTable, SkeletonCard } from '@/components/ui/Skeleton';

export default function Dashboard() {
  const {
    links,
    pagination,
    loading,
    error,
    searchQuery,
    currentPage,
    fetchLinks,
    setSearchQuery,
    setCurrentPage,
  } = useLinkStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, setSearchQuery]);

  // Sync localSearch with searchQuery when it changes externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Hero Section */}
      <div className="card gradient-glow relative overflow-hidden animate-in slide-down">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-primary-400 mb-2 animate-in fade-in">Welcome to TinyLink</p>
              <h2 className="text-4xl font-bold text-white mb-2 animate-in slide-up">Manage Your Links Efficiently</h2>
              <p className="text-gray-400 animate-in fade-in">Shorten URLs and track analytics for your satisfaction</p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="w-full sm:w-auto hover-lift animate-in zoom-in-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Link
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="animate-in slide-down">
          <Alert
            type="error"
            message={error}
            onClose={() => useLinkStore.setState({ error: null })}
          />
        </div>
      )}

      {/* Search Bar */}
      <div className="card animate-in slide-up">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search by code, URL, or title..."
            value={localSearch}
            onChange={handleSearchChange}
            className="pl-12"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && links.length === 0 ? (
        <div className="space-y-6 animate-in fade-in">
          <SkeletonTable />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {/* Links Table */}
          <div className="animate-in slide-up">
            <LinkTable links={links} />
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="card animate-in slide-up">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-400 text-center sm:text-left">
                  Showing {((currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} links
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="text-sm transition-smooth"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === pagination.pages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? 'primary' : 'secondary'}
                            onClick={() => handlePageChange(page)}
                            disabled={loading}
                            className="min-w-[40px] text-sm transition-smooth"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages || loading}
                    className="text-sm transition-smooth"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Link Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Link"
        size="lg"
      >
        <CreateLinkForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchLinks();
          }}
        />
      </Modal>
    </div>
  );
}

