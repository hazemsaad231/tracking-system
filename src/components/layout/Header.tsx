import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search,Moon, Sun, ChevronDown, Calendar } from 'lucide-react';
import { PAGE_TITLES, DEFAULT_PAGE_META } from '@/constants';
import { useTheme } from '@/context/ThemeContext';
import { useAuthContext } from '@/context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
    const { user } = useAuthContext()

  
  const [showSearch, setShowSearch] = useState(false);
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const currentPage = PAGE_TITLES[location.pathname] || DEFAULT_PAGE_META;

  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-700/50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Page Title & Date */}
        <div className="flex-1 min-w-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Calendar size={12} />
            <span>{today}</span>
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white truncate">{currentPage.title}</h1>
          <p className="text-sm  text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block truncate">{currentPage.subtitle}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search for small screens (overlay) */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowSearch(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all duration-200"
              aria-label="بحث"
            >
              <Search size={18} />
            </button>
            {showSearch && (
              <div className="absolute top-0 left-0 w-full h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 z-40">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="بحث..."
                    autoFocus
                    onBlur={() => setShowSearch(false)}
                    className="w-full h-12 pr-10 pl-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            )}
          </div>

          {/* Search for large screens (inline) */}
          <div className={`hidden sm:flex relative transition-all duration-300 ${showSearch ? 'w-64' : 'w-10'}`}>
            {showSearch && (
              <input
                type="text"
                placeholder="بحث عن موظف أو عميل..."
                autoFocus
                onBlur={() => setShowSearch(false)}
                className="w-full h-10 pr-10 pl-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              />
            )}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`${showSearch ? 'absolute right-0 top-0' : ''} w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all duration-200`}
              aria-label="بحث"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Theme Toggle */}
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-200" aria-label="تبديل الوضع">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button className="flex items-center gap-3 pl-1 pr-2 sm:px-3 py-1.5 rounded-full sm:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.role}</p>
                </div>
                <ChevronDown size={14} className="hidden md:block text-slate-400 group-hover:text-violet-500 transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a href="/login" className="text-sm font-medium text-slate-900 dark:text-white">Login</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
