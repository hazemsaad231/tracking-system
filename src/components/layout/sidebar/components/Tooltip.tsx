import React from 'react';

const Tooltip = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative group/tip">
    {children}
    <span className="
      absolute right-full top-1/2 -translate-y-1/2 mr-3 z-50
      bg-gray-900 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg
      whitespace-nowrap shadow-xl border border-white/10
      pointer-events-none opacity-0 -translate-x-1
      group-hover/tip:opacity-100 group-hover/tip:translate-x-0 group-hover/tip:pointer-events-auto
      transition-all duration-200
    ">
      {label}
    </span>
  </div>
);

export default Tooltip;
