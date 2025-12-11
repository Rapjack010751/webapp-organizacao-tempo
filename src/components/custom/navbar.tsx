"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Settings, User, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(auth.getCurrentUser());
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setUser(auth.getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      auth.logout();
      router.push('/login');
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              TimeFlow
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        router.push('/settings');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <Settings className="w-5 h-5" />
                      Configurações
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 mb-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                router.push('/settings');
                setShowMobileMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300"
            >
              <Settings className="w-5 h-5" />
              Configurações
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
