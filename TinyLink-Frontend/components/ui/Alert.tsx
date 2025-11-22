import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: 'bg-green-900/30 border-green-700 text-green-300',
    error: 'bg-red-900/30 border-red-700 text-red-300',
    warning: 'bg-yellow-900/30 border-yellow-700 text-yellow-300',
    info: 'bg-blue-900/30 border-blue-700 text-blue-300',
  };

  const Icon = icons[type];

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 ${styles[type]}`}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

