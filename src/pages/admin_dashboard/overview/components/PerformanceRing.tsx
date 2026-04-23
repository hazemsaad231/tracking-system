import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { PerformanceItem } from '@/types';

interface PerformanceRingProps {
  title: string;
  percentage: number;
  centerLabel: string;
  items: PerformanceItem[];
  trendValue?: string;
  trendLabel?: string;
}

const PerformanceRing: React.FC<PerformanceRingProps> = ({
  title,
  percentage,
  centerLabel,
  items,
  trendValue,
  trendLabel,
}) => {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-5">{title}</h3>

      {/* الدائرة */}
      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-violet-500"
              stroke="currentColor"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {percentage}%
            </span>
            <span className="text-xs text-slate-400">{centerLabel}</span>
          </div>
        </div>
      </div>

      {/* التفاصيل */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="flex-1 text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* الاتجاه */}
      {trendValue && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              {trendValue}
            </span>
            {trendLabel && <span className="text-xs text-slate-400">{trendLabel}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceRing;
