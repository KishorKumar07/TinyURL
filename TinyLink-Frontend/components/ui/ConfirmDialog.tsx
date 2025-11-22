'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const variantStyles = {
    danger: 'text-red-400 bg-red-900/20 border-red-700',
    warning: 'text-yellow-400 bg-yellow-900/20 border-yellow-700',
    info: 'text-blue-400 bg-blue-900/20 border-blue-700',
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const dialogContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/20 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg border ${variantStyles[variant]}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-300">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={handleConfirm}
              isLoading={isLoading}
              className="min-w-[100px]"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render to document body using portal
  return createPortal(dialogContent, document.body);
};

