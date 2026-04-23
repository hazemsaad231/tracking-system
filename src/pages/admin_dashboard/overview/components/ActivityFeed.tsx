import React from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import type { Activity, ActivityType } from '@/types';

/* ─── إعدادات أنواع الأنشطة ─── */
const ACTIVITY_TYPE_CONFIG: Record<
  ActivityType,
  { icon: React.ReactElement; color: string; bg: string }
> = {
  success: {
    icon: <CheckCircle2 size={16} />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  info: {
    icon: <RefreshCw size={16} />,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
};

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'آخر الأنشطة',
  subtitle = 'سجل الأنشطة والتحديثات',
  onViewAll,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium transition-colors"
          >
            عرض الكل
          </button>
        )}
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const config = ACTIVITY_TYPE_CONFIG[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center ${config.color} flex-shrink-0 mt-0.5`}
              >
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">{activity.message}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
