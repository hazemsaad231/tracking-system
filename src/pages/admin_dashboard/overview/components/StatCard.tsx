import React from 'react';
import { ArrowUpLeft, ArrowDownLeft } from 'lucide-react';
import type { StatCardProps } from '@/types';
import { STAT_CARD_COLORS } from '@/constants';

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const colors = STAT_CARD_COLORS[color];
  const isPositive = change >= 0;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* تأثير التدرج عند التمرير */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
              }`}
            >
              {isPositive ? <ArrowUpLeft size={12} /> : <ArrowDownLeft size={12} />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-slate-400">من الأسبوع الماضي</span>
          </div>
        </div>

        <div
          className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.icon} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
