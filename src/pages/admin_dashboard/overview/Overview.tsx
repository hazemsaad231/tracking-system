import React from 'react';
import { 
  Users, UserCheck, Clock,
  Target, Zap, Activity, BarChart3, PieChart, ArrowUpLeft, ArrowDownLeft, MoreHorizontal
} from 'lucide-react';
import {
  StatCard,
  BarChart,
  EmployeesTable,
  ClientsTable,
  ActivityFeed,
  PerformanceRing,
} from './components';
import {
  MOCK_EMPLOYEES,
  MOCK_CLIENTS,
  MOCK_ACTIVITIES,
  WEEKLY_CHART_DATA,
  PERFORMANCE_BREAKDOWN,
  MONTHLY_CHART_DATA,
  DEPARTMENT_DISTRIBUTION,
  DONUT_COLORS,
} from '@/constants';

/* ─── مؤشرات الأداء ─── */
const kpiCards = [
  { title: 'معدل الإنجاز', value: '94.5%', change: 3.2, icon: <Target size={20} />, gradient: 'from-violet-500 to-purple-600' },
  { title: 'متوسط وقت المهمة', value: '2.3 يوم', change: -8.1, icon: <Zap size={20} />, gradient: 'from-blue-500 to-cyan-600' },
  { title: 'رضا العملاء', value: '4.8/5', change: 1.5, icon: <Activity size={20} />, gradient: 'from-emerald-500 to-teal-600' },
];

/* ─── أفضل الموظفين ─── */
const topEmployees = [
  { name: 'أحمد محمود', tasks: 156, percentage: 30 },
  { name: 'سارة علي', tasks: 134, percentage: 26 },
  { name: 'فاطمة حسن', tasks: 98, percentage: 19 },
  { name: 'خالد يوسف', tasks: 76, percentage: 15 },
  { name: 'عمر إبراهيم', tasks: 52, percentage: 10 },
];

const Overview: React.FC = () => {
  const maxVal = Math.max(...MONTHLY_CHART_DATA.map((d) => d.value));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* بطاقات الإحصائيات (Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الموظفين"
          value="124"
          change={5.2}
          icon={<UserCheck size={22} />}
          color="violet"
        />
        <StatCard
          title="الموظفين المتصلين"
          value="98"
          change={12.5}
          icon={<Users size={22} />}
          color="blue"
        />
        <StatCard
          title="إجمالي العملاء"
          value="1,456"
          change={8.3}
          icon={<Users size={22} />}
          color="emerald"
        />
        <StatCard
          title="في إجازة"
          value="12"
          change={-3.1}
          icon={<Clock size={22} />}
          color="amber"
        />
      </div>

      {/* KPI Cards (Analytics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiCards.map((card, i) => {
          const isPositive = card.change >= 0;
          return (
            <div key={i} className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-l ${card.gradient}`} />
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>{card.icon}</div>
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                  {isPositive ? <ArrowUpLeft size={12} /> : <ArrowDownLeft size={12} />}
                  {Math.abs(card.change)}%
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* الرسم البياني الأسبوعي + جدول الموظفين (Overview) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <BarChart
          data={WEEKLY_CHART_DATA}
          title="نشاط الأسبوع"
          subtitle="عدد المهام المنجزة يومياً"
          tooltipSuffix="مهمة"
        />
        <div className="xl:col-span-2">
          <EmployeesTable
            employees={MOCK_EMPLOYEES}
            title="آخر الموظفين"
            subtitle="حالة الموظفين في النظام"
            onViewAll={() => {}}
          />
        </div>
      </div>

      {/* الرسم البياني الشهري + التوزيع (Analytics) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-violet-500" />
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">المهام الشهرية</h3>
                <p className="text-xs text-slate-400 mt-0.5">إحصائيات آخر 6 أشهر</p>
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="flex items-end justify-between gap-4" style={{ height: '400px' }}>
            {MONTHLY_CHART_DATA.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group cursor-pointer">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                    {item.value} مهمة
                  </div>
                  <div
                    className="w-full rounded-xl bg-gradient-to-t from-violet-600 to-violet-400 dark:from-violet-700 dark:to-violet-400 transition-all duration-300 hover:from-violet-700 hover:to-violet-500 shadow-sm hover:shadow-md hover:shadow-violet-500/20"
                    style={{ height: `${(item.value / maxVal) * 180}px` }}
                  />
                </div>
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* توزيع الأقسام */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={18} className="text-violet-500" />
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">توزيع الأقسام</h3>
              <p className="text-xs text-slate-400 mt-0.5">الموظفين حسب القسم</p>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {(() => {
                  let acc = 0;
                  return DEPARTMENT_DISTRIBUTION.map((d, i) => {
                    const circ = 2 * Math.PI * 48;
                    const dash = (d.percentage / 100) * circ;
                    const off = (acc / 100) * circ;
                    acc += d.percentage;
                    return <circle key={i} cx="60" cy="60" r="48" fill="none" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-off} stroke={DONUT_COLORS[i]} style={{ transition: 'all 0.8s ease-in-out' }} />;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-900 dark:text-white">5</span>
                <span className="text-[10px] text-slate-400">أقسام</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {DEPARTMENT_DISTRIBUTION.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${d.color}`} />
                <span className="flex-1 text-sm text-slate-600 dark:text-slate-400">{d.name}</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* جدول العملاء + الأنشطة + الأداء (Overview) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ClientsTable
            clients={MOCK_CLIENTS}
            title="آخر العملاء"
            subtitle="قائمة العملاء الأخيرة في النظام"
            onViewAll={() => {}}
          />
          <ActivityFeed
            activities={MOCK_ACTIVITIES}
            onViewAll={() => {}}
          />
        </div>
        <div className="space-y-6">
          <PerformanceRing
            title="أداء الموظفين"
            percentage={72}
            centerLabel="ممتاز"
            items={PERFORMANCE_BREAKDOWN}
            trendValue="+5.2%"
            trendLabel="تحسن عن الشهر السابق"
          />

          {/* أفضل الموظفين (Analytics) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">أفضل الموظفين أداءً</h3>
                <p className="text-xs text-slate-400 mt-1">حسب عدد المهام المنجزة</p>
              </div>
              <button className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium transition-colors">عرض الكل</button>
            </div>
            <div className="space-y-4">
              {topEmployees.map((emp, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/10 to-blue-500/10 dark:from-violet-500/20 dark:to-blue-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm">{i + 1}</div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{emp.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{emp.tasks} مهمة</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{emp.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-l from-violet-500 to-blue-500 transition-all duration-700 group-hover:shadow-md group-hover:shadow-violet-500/30" style={{ width: `${emp.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
