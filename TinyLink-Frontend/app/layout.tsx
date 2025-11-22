import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TinyLink - URL Shortener',
  description: 'Shorten your URLs and track analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-screen flex flex-col relative overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-dark"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-glow/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial opacity-30"></div>
          </div>
          
          <Navbar />
          
          <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {children}
          </main>
          
          <footer className="relative z-10 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-400">
              © {new Date().getFullYear()} TinyLink. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

