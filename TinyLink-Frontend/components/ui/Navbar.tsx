'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Link2, BarChart3 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Link2 },
  ];

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <h1 className="text-2xl font-bold text-white relative z-10">
                TinyLink<span className="text-primary-400">.</span>
              </h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-glow-purple'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
};

