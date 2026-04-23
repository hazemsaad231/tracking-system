import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { ChartDataPoint } from '@/types';

interface BarChartProps {
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
  height?: number;
  tooltipSuffix?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
  height = 240,
  tooltipSuffix = '',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <button className="w-8 h-8 flex items-end justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex items-end justify-end gap-3" style={{ height : 400 }}>
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative group cursor-pointer">
              {/* Tooltip */}
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                {item.value} {tooltipSuffix}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-slate-900 dark:bg-slate-700 rotate-45" />
              </div>
              <div
                className="w-full h-full rounded-lg bg-gradient-to-t from-violet-500 to-violet-400 dark:from-violet-600 dark:to-violet-400 transition-all duration-300 hover:from-violet-600 hover:to-violet-500 shadow-sm hover:shadow-md hover:shadow-violet-500/20"
                style={{
                  height: `${(item.value / maxValue) * (height - 20)}px`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
