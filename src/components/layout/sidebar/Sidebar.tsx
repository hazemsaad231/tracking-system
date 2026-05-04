import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Play } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import NAVIGATION_MAP from '../navConfig';
import smallLogo from '../../../assets/small.png';

import NavItem from './components/NavItem';
import Avatar from './components/Avatar';
import Divider from './components/Divider';
import Tooltip from './components/Tooltip';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthContext();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const userRole = user?.role;
  if (!userRole) return null;

  const navConfig = NAVIGATION_MAP[userRole];
  const navItems = navConfig?.items || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
    localStorage.removeItem('token');
    sessionStorage.removeItem('onboarding_skipped');
  };

  return (
    <>
      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile FAB ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`fixed bottom-6 left-6 z-50 lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl
          bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-2xl shadow-violet-500/40
          transition-all duration-300 ${mobileOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="قائمة التنقل"
      >
        <Menu size={20} />
      </button>

      {/* ══════════════════════════ SIDEBAR ══════════════════════════ */}
      <aside
        dir="rtl"
        className={`fixed lg:sticky top-0 right-0 h-screen z-50 lg:z-auto flex flex-col
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-[76px]' : 'lg:w-[256px]'}
          w-[256px]`}
        style={{
          background: 'var(--one-color)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}
      >

        {/* ── Collapse toggle pill ── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'فتح القائمة' : 'تصغير القائمة'}
          className={`absolute top-11 -left-3.5 z-50 hidden lg:flex items-center justify-center
            w-7 h-7 rounded-full bg-white shadow-lg border border-slate-100
            hover:scale-110 transition-all duration-200`}
        >
          <Play
            size={13}
            className={`text-slate-500 transition-transform duration-300 ${collapsed ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-5">
          <div
            className="w-10 h-10 shrink-0 rounded-xl overflow-hidden ring-2 ring-white/10"
            style={{ boxShadow: '0 4px 14px rgba(139,92,246,.45)' }}
          >
            <img src={smallLogo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'}`}>
            <h2 className="text-white font-bold text-[15px] tracking-tight leading-tight whitespace-nowrap">نظام التتبع</h2>
            <p className="text-violet-300/70 text-[11px] font-medium whitespace-nowrap mt-0.5">{navConfig?.label || ''}</p>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <Divider />

        {/* ── Nav items ── */}
        <nav className={`flex-1 py-3 px-3 space-y-1 scrollbar-none ${collapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname + location.search === item.path;

            return (
              <NavItem
                key={item.path}
                item={item}
                isActive={isActive}
                collapsed={collapsed}
                onClick={() => setMobileOpen(false)}
              />
            );
          })}
        </nav>

        {/* Divider */}
        <Divider />

        {/* ── Footer ── */}
        <div className="p-3 space-y-2">
          {/* User card */}
          <div
            className={`flex items-center gap-3 rounded-xl transition-all duration-300
              ${collapsed ? 'justify-center p-2' : 'p-3 bg-white/5 border border-white/8'}`}
          >
            <Avatar name={user?.name} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-[13px] font-semibold truncate leading-tight">{user?.name || 'User'}</p>
                <p className="text-violet-300/60 text-[11px] truncate mt-0.5">{navConfig?.label || ''}</p>
              </div>
            )}
          </div>

          {/* Logout */}
          {collapsed ? (
            <Tooltip label="تسجيل الخروج">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-400
                  hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/15
                  transition-all duration-200"
                aria-label="تسجيل الخروج"
              >
                <LogOut size={17} />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-slate-400 text-[13px] font-medium
                hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/15
                transition-all duration-200"
            >
              <LogOut size={15} />
              <span>تسجيل الخروج</span>
            </button>
          )}
        </div>
      </aside>

      {/* ── Logout confirm dialog ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl p-7 w-80 text-center"
            style={{ animation: 'fadeUp .22s ease' }}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 ring-4 ring-red-100">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-[16px] font-bold text-gray-800 mb-1">تسجيل الخروج</h3>
            <p className="text-[13px] text-gray-400 mb-6">هل أنت متأكد من أنك تريد تسجيل الخروج؟</p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold transition-colors"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

export default Sidebar;