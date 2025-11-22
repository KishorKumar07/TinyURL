import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines,
}) => {
  const baseClasses = 'animate-pulse bg-gray-700 rounded';
  
  if (variant === 'text' && lines) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${i === lines - 1 ? 'w-3/4' : 'w-full'} ${className}`}
            style={{ height: height || '1rem' }}
          />
        ))}
      </div>
    );
  }

  const shapeClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${shapeClasses[variant]} ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
};

// Pre-built skeleton components
export const SkeletonCard: React.FC = () => (
  <div className="card">
    <Skeleton variant="rectangular" height="2rem" className="mb-4" />
    <Skeleton variant="text" lines={3} />
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="card overflow-hidden p-0">
    <div className="p-6 space-y-4">
      <Skeleton variant="rectangular" height="3rem" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton variant="rectangular" width="20%" height="2rem" />
          <Skeleton variant="rectangular" width="40%" height="2rem" />
          <Skeleton variant="rectangular" width="15%" height="2rem" />
          <Skeleton variant="rectangular" width="15%" height="2rem" />
          <Skeleton variant="rectangular" width="10%" height="2rem" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="card">
    <Skeleton variant="rectangular" height="1.5rem" width="40%" className="mb-6" />
    <Skeleton variant="rectangular" height="300px" />
  </div>
);

