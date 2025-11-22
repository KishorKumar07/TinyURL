'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const reason = searchParams.get('reason') || 'not-found';
  const code = searchParams.get('code') || '';
  
  const getErrorMessage = () => {
    switch (reason) {
      case 'expired':
        return {
          title: 'Link Expired',
          message: 'This link has expired and is no longer available.',
          icon: '⏰',
        };
      case 'deactivated':
        return {
          title: 'Link Deactivated',
          message: 'This link has been deactivated and is no longer available.',
          icon: '🚫',
        };
      case 'not-found':
      default:
        return {
          title: 'Link Not Found',
          message: 'The link you are looking for does not exist or has been removed.',
          icon: '🔍',
        };
    }
  };
  
 
  
  const error = getErrorMessage();
  
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-md w-full space-y-6 animate-in fade-in">
        <div className="flex justify-center">
          <div className="p-4 bg-red-900/20 rounded-full border border-red-700">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">{error.title}</h1>
          <p className="text-gray-400">{error.message}</p>
          {code && (
            <p className="text-sm text-gray-500 font-mono mt-2">Code: {code}</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.push('/')}
            className="hover-lift transition-smooth"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
         
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card text-center max-w-md w-full space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-red-900/20 rounded-full border border-red-700">
              <AlertCircle className="w-12 h-12 text-red-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

