'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ExternalLink, Trash2, BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Link } from '@/types';
import { useLinkStore } from '@/store/useLinkStore';
import { useRouter } from 'next/navigation';

interface LinkTableProps {
  links: Link[];
}

export const LinkTable: React.FC<LinkTableProps> = ({ links }) => {
  const { deleteLink, loading } = useLinkStore();
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; code: string | null }>({
    isOpen: false,
    code: null,
  });

  const handleDeleteClick = (code: string) => {
    setDeleteConfirm({ isOpen: true, code });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.code) {
      await deleteLink(deleteConfirm.code);
      setDeleteConfirm({ isOpen: false, code: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, code: null });
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const isExpired = (expiresAt: string | null | undefined): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getExpirationStatus = (link: Link) => {
    if (!link.expiresAt) return null;
    const expired = isExpired(link.expiresAt);
    return {
      expired,
      date: link.expiresAt,
      formatted: format(new Date(link.expiresAt), 'MMM d, yyyy HH:mm'),
    };
  };

  if (links.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-400">No links found. Create your first short link!</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Short Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Short URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-primary-400">
                      {link.shortCode}
                    </span>
                    <CopyButton text={link.shortUrl} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 max-w-md">
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 truncate flex items-center gap-1"
                      title={link.shortUrl}
                    >
                      {truncateUrl(link.shortUrl)}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-white font-medium">{link.clicks}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {format(new Date(link.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(() => {
                    const expiration = getExpirationStatus(link);
                    if (!expiration) {
                      return <span className="text-sm text-gray-500">Never</span>;
                    }
                    return (
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`w-4 h-4 ${
                            expiration.expired ? 'text-red-400' : 'text-yellow-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            expiration.expired ? 'text-red-400' : 'text-yellow-400'
                          }`}
                          title={expiration.formatted}
                        >
                          {expiration.expired ? 'Expired' : expiration.formatted}
                        </span>
                      </div>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => router.push(`/code/${link.shortCode}`)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-smooth"
                      title="View stats"
                    >
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(link.shortCode)}
                      disabled={loading}
                      className="p-2 hover:bg-red-900/30 rounded-lg transition-smooth disabled:opacity-50"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-700">
        {links.map((link) => (
          <div key={link.id} className="p-4 hover:bg-gray-700/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-semibold text-primary-400">
                    {link.shortCode}
                  </span>
                  <CopyButton text={link.shortUrl} />
                </div>
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 break-all"
                  title={link.originalUrl}
                >
                  {truncateUrl(link.originalUrl, 40)}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-gray-400">
                  <span className="font-medium text-white">{link.clicks}</span> clicks
                </span>
                <span className="text-gray-500">
                  {format(new Date(link.createdAt), 'MMM d, yyyy')}
                </span>
                {(() => {
                  const expiration = getExpirationStatus(link);
                  if (expiration) {
                    return (
                      <div className="flex items-center gap-1">
                        <Clock
                          className={`w-3 h-3 ${
                            expiration.expired ? 'text-red-400' : 'text-yellow-400'
                          }`}
                        />
                        <span
                          className={expiration.expired ? 'text-red-400' : 'text-yellow-400'}
                        >
                          {expiration.expired
                            ? 'Expired'
                            : `Expires: ${format(new Date(expiration.date), 'MMM d')}`}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/code/${link.shortCode}`)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="View stats"
                >
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => handleDeleteClick(link.shortCode)}
                  disabled={loading}
                  className="p-2 hover:bg-red-900/30 rounded-lg transition-smooth disabled:opacity-50"
                  title="Delete link"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Link"
        message="Are you sure you want to delete this link? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
};

