import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const NavItem = ({ item, isActive, collapsed, onClick }: any) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;

  const isExactMatch = (path: string) => {
    return location.pathname + location.search === path || (location.pathname === path && location.search === '');
  };

  const isChildActive = hasChildren && item.children.some((child: any) => isExactMatch(child.path));

  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive && !collapsed) {
      setIsOpen(true);
    }
  }, [isChildActive, collapsed]);

  const effectivelyActive = isActive || isChildActive;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && !collapsed) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      onClick();
    }
  };

  return (
    <div className="relative group/nav flex flex-col">
      <Link
        to={item.path}
        onClick={handleClick}
        className={`relative flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 overflow-hidden
          ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-3'}
          ${effectivelyActive
            ? 'bg-white text-[--one-color] shadow-lg shadow-violet-900/30'
            : 'text-slate-300 hover:text-white hover:bg-white/8'
          }`}
      >
        {/* Glow for active */}
        {effectivelyActive && (
          <span
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.15)' }}
          />
        )}

        <span className={`shrink-0 transition-colors duration-200 ${effectivelyActive ? 'text-[--one-color]' : 'text-slate-400 group-hover/nav:text-slate-200'}`}>
          {item.icon}
        </span>

        {!collapsed && (
          <>
            <span className="flex-1 whitespace-nowrap">{item.label}</span>
            {hasChildren ? (
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''} ${effectivelyActive ? 'text-[--one-color]' : 'text-slate-400'}`}
              />
            ) : effectivelyActive && (
              <ChevronLeft size={13} className="text-[--one-color] opacity-60 shrink-0" />
            )}
          </>
        )}
      </Link>

      {/* Children Dropdown */}
      {hasChildren && !collapsed && (
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: isOpen ? `${item.children.length * 48}px` : '0px', opacity: isOpen ? 1 : 0 }}
        >
          <div className="flex flex-col gap-1 pl-3 pr-2 border-r-2 border-white/10 mt-1 mb-2">
            {item.children.map((child: any) => {
              const isChildCurrent = isExactMatch(child.path);
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={onClick}
                  className={`px-3 py-2.5 rounded-2xl text-[12px] font-medium transition-all ${isChildCurrent
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Tooltip or Floating Menu when collapsed */}
      {collapsed && (
        <div className={`
          absolute right-full mr-3 z-50
          ${hasChildren ? 'bg-[var(--one-color)] backdrop-blur-md p-1.5 min-w-[160px] top-0' : 'bg-[var(--one-color)] px-3 py-1.5 top-1/2 -translate-y-1/2'}
          rounded-xl border border-white/10 shadow-2xl
          opacity-0 -translate-x-2 pointer-events-none
          group-hover/nav:opacity-100 group-hover/nav:translate-x-0 group-hover/nav:pointer-events-auto
          transition-all duration-200
        `}>
          {/* Invisible bridge to prevent hover loss */}
          <div className="absolute top-0 -right-4 w-4 h-full" />

          {hasChildren ? (
            <div className="flex flex-col">
              <div className="px-3 py-2 mb-1 border-b border-white/10 text-[12px] font-bold text-white whitespace-nowrap">
                {item.label}
              </div>
              {item.children.map((child: any) => {
                const isChildCurrent = isExactMatch(child.path);
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={onClick}
                    className={`px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${isChildCurrent
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <span className="text-white text-[12px] font-medium whitespace-nowrap">{item.label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NavItem;
