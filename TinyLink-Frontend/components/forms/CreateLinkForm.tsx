'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLinkStore } from '@/store/useLinkStore';

interface CreateLinkFormProps {
  onSuccess?: () => void;
}

export const CreateLinkForm: React.FC<CreateLinkFormProps> = ({ onSuccess }) => {
  const { createLink, loading } = useLinkStore();
  const [formData, setFormData] = useState({
    originalUrl: '',
    shortCode: '',
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateShortCode = (code: string): boolean => {
    if (!code) return true; // Optional
    return /^[A-Za-z0-9]{6,8}$/.test(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Validation
    if (!formData.originalUrl.trim()) {
      setErrors({ originalUrl: 'URL is required' });
      return;
    }

    if (!validateUrl(formData.originalUrl)) {
      setErrors({ originalUrl: 'Must be a valid http:// or https:// URL' });
      return;
    }

    if (formData.shortCode && !validateShortCode(formData.shortCode)) {
      setErrors({
        shortCode: 'Short code must be 6-8 alphanumeric characters',
      });
      return;
    }

    const result = await createLink({
      originalUrl: formData.originalUrl.trim(),
      shortCode: formData.shortCode.trim() || undefined,
      title: formData.title.trim() || undefined,
      description: formData.description.trim() || undefined,
    });

    if (result.success) {
      setSuccess(true);
      setFormData({
        originalUrl: '',
        shortCode: '',
        title: '',
        description: '',
      });
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } else {
      setErrors({ submit: result.error || 'Failed to create link' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm">
          Link created successfully!
        </div>
      )}

      {errors.submit && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {errors.submit}
        </div>
      )}

      <Input
        label="Original URL *"
        type="url"
        placeholder="https://example.com"
        value={formData.originalUrl}
        onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
        error={errors.originalUrl}
        required
      />

      <Input
        label="Custom Short Code (Optional)"
        placeholder="6-8 alphanumeric characters"
        value={formData.shortCode}
        onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
        error={errors.shortCode}
        maxLength={8}
      />

      <Input
        label="Title (Optional)"
        placeholder="Link title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <Input
        label="Description (Optional)"
        placeholder="Link description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={loading} className="flex-1">
          Create Link
        </Button>
      </div>
    </form>
  );
};

