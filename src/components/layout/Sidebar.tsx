import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Shield, Menu, X, House, FileChartColumnIncreasing, Wrench, Users, FilePlus2, FunnelPlus, ChevronRight } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const adminNavItems = [
  { label: 'الرئيسية', icon: <House size={18} />, path: '/dashboard/overview' },
  { label: 'المستخدمين', icon: <Users size={18} />, path: '/dashboard/users' },
  { label: 'الأدوار', icon: <Shield size={18} />, path: '/dashboard/roles' },
  { label: 'الصلاحيات', icon: <Shield size={18} />, path: '/dashboard/permissions' },
  { label: 'الإعدادات', icon: <Wrench size={18} />, path: '/dashboard/settings' },
];

const clientNavItems = [
  { label: 'الاحصائيات', icon: <House size={18} />, path: '/dashboard' },
  { label: 'تقاريري', icon: <FileChartColumnIncreasing size={18} />, path: '/dashboard/reports' },
  { label: 'خدماتي', icon: <Wrench size={18} />, path: '/dashboard/client-services' },
  { label: 'إنشاء تقرير', icon: <FilePlus2 size={18} />, path: '/dashboard/new-report' },
  { label: 'طلب خدمة', icon: <FunnelPlus size={18} />, path: '/dashboard/add-services' },
  { label: 'الإعدادات', icon: <Wrench size={18} />, path: '/dashboard/settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAdmin } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navItems = isAdmin() ? adminNavItems : clientNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
    localStorage.removeItem('token');
    sessionStorage.removeItem('onboarding_skipped');
  };

  const navSections = [
    {
      items: navItems,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`fixed bottom-6 left-6 z-50 lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-2xl shadow-violet-500/40
          transform transition-all duration-300 ease-in-out
          ${mobileOpen ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="قائمة التنقل"
      >
        <Menu size={22} />
      </button>
      
      {/* <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`fixed top-5 left-20 z-[60] lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white
          transform transition-all duration-300 ease-in-out
          ${mobileOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        aria-label="إغلاق القائمة"
      >
        <X size={20} />
      </button> */}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen z-50 lg:z-auto transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          w-[272px] flex flex-col`}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-20 -left-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-10 w-32 h-32 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex justify-between relative p-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">نظام التتبع</h2>
              <p className="text-slate-400 text-[11px]">لوحة تحكم {isAdmin() ? 'المسؤول' : 'العميل'}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-10 h-10 bg-white/10 backdrop-blur-md flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>
          
        </div>

        <div className="mx-5 h-px bg-gradient-to-l from-transparent via-slate-600/50 to-transparent" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative overflow-hidden
                        ${isActive
                          ? 'bg-gradient-to-l from-violet-600/30 to-blue-600/20 text-white shadow-lg shadow-violet-500/10 border border-violet-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-violet-400 to-blue-500 rounded-full" />
                      )}
                      <span className={`transition-colors duration-200 ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-violet-400'}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight size={14} className={`transition-all duration-200 ${
                        isActive ? 'text-violet-400 opacity-100' : 'opacity-0 translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                      }`} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mx-5 h-px bg-gradient-to-l from-transparent via-slate-600/50 to-transparent" />

        {/* User */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-slate-400 text-[11px] truncate">{isAdmin() ? 'مسؤول النظام' : 'عميل'}</p>
            </div>
          </div>
          <button onClick={() => setShowConfirm(true)} className="mt-2.5 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 text-sm">
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">تسجيل الخروج</h3>
            <p className="text-sm text-gray-500 mb-6">هل أنت متأكد من أنك تريد تسجيل الخروج؟</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
