import type {
  Employee,
  Client,
  Activity,
  ChartDataPoint,
  DistributionItem,
} from '@/types';

/* ─── حالات الموظفين ─── */
export const EMPLOYEE_STATUS_CONFIG = {
  active: {
    label: 'متصل',
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  onLeave: {
    label: 'في إجازة',
    bg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  remote: {
    label: 'عمل عن بُعد',
    bg: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  inactive: {
    label: 'غير متصل',
    bg: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    dot: 'bg-red-500',
  },
} as const;

/* ─── حالات العملاء ─── */
export const CLIENT_STATUS_CONFIG = {
  active: {
    label: 'نشط',
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  new: {
    label: 'جديد',
    bg: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  vip: {
    label: 'VIP',
    bg: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
    dot: 'bg-violet-500',
  },
  suspended: {
    label: 'موقوف',
    bg: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    dot: 'bg-red-500',
  },
} as const;

/* ─── ألوان بطاقات الإحصائيات ─── */
export const STAT_CARD_COLORS = {
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    icon: 'text-violet-600 dark:text-violet-400',
    gradient: 'from-violet-500 to-purple-600',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    icon: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-cyan-600',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    icon: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-teal-600',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    icon: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-600',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    icon: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-500 to-pink-600',
  },
} as const;

/* ═══════════════════════════════════════════════
   بيانات تجريبية (Mock Data)
   ═══════════════════════════════════════════════ */

/* ─── آخر الموظفين ─── */
export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'أحمد محمود', role: 'مطور أنظمة', department: 'تقنية المعلومات', status: 'active', lastSeen: 'متصل الآن' },
  { id: 'EMP-002', name: 'سارة علي', role: 'مديرة مشاريع', department: 'الإدارة', status: 'active', lastSeen: 'منذ 5 دقائق' },
  { id: 'EMP-003', name: 'خالد يوسف', role: 'محاسب', department: 'المالية', status: 'onLeave', lastSeen: 'منذ يومين' },
  { id: 'EMP-004', name: 'فاطمة حسن', role: 'مصممة واجهات', department: 'تقنية المعلومات', status: 'remote', lastSeen: 'منذ 30 دقيقة' },
  { id: 'EMP-005', name: 'عمر إبراهيم', role: 'مندوب مبيعات', department: 'المبيعات', status: 'inactive', lastSeen: 'منذ 3 أيام' },
];

/* ─── آخر العملاء ─── */
export const MOCK_CLIENTS: Client[] = [
  { id: 'CLT-101', name: 'شركة النور للتجارة', company: 'مجموعة النور', assignedTo: 'أحمد محمود', status: 'vip', lastContact: 'منذ ساعة' },
  { id: 'CLT-102', name: 'مؤسسة الأمل الدولية', company: 'الأمل القابضة', assignedTo: 'سارة علي', status: 'active', lastContact: 'منذ 3 ساعات' },
  { id: 'CLT-103', name: 'شركة البركة للحلول', company: 'البركة', assignedTo: 'عمر إبراهيم', status: 'new', lastContact: 'اليوم' },
  { id: 'CLT-104', name: 'مصنع الفجر الصناعي', company: 'الفجر', assignedTo: 'أحمد محمود', status: 'active', lastContact: 'منذ يوم' },
  { id: 'CLT-105', name: 'شركة الوفاء للخدمات', company: 'الوفاء', assignedTo: 'سارة علي', status: 'suspended', lastContact: 'منذ أسبوع' },
];

/* ─── سجل الأنشطة ─── */
export const MOCK_ACTIVITIES: Activity[] = [
  { id: 1, message: 'أحمد محمود قام بتحديث بيانات العميل شركة النور', time: 'منذ 15 دقيقة', type: 'success' },
  { id: 2, message: 'تنبيه: الموظف عمر إبراهيم غير متصل منذ 3 أيام', time: 'منذ 30 دقيقة', type: 'warning' },
  { id: 3, message: 'تم تسجيل عميل جديد: شركة البركة للحلول', time: 'منذ ساعة', type: 'info' },
  { id: 4, message: 'سارة علي أنهت مهمة متابعة مؤسسة الأمل', time: 'منذ ساعتين', type: 'success' },
  { id: 5, message: 'تحذير: العميل شركة الوفاء — حساب موقوف', time: 'منذ 3 ساعات', type: 'warning' },
];

/* ─── إحصائيات الأسبوع ─── */
export const WEEKLY_CHART_DATA: ChartDataPoint[] = [
  { label: 'سبت', value: 18 },
  { label: 'أحد', value: 12 },
  { label: 'إثن', value: 22 },
  { label: 'ثلا', value: 15 },
  { label: 'أرب', value: 28 },
  { label: 'خمي', value: 20 },
  { label: 'جمع', value: 8 },
];

/* ─── الإحصائيات الشهرية ─── */
export const MONTHLY_CHART_DATA: ChartDataPoint[] = [
  { label: 'يناير', value: 45 },
  { label: 'فبراير', value: 52 },
  { label: 'مارس', value: 48 },
  { label: 'أبريل', value: 72 },
  { label: 'مايو', value: 65 },
  { label: 'يونيو', value: 82 },
];

/* ─── توزيع الأقسام ─── */
export const DEPARTMENT_DISTRIBUTION: DistributionItem[] = [
  { name: 'تقنية المعلومات', percentage: 30, color: 'bg-violet-500' },
  { name: 'المبيعات', percentage: 25, color: 'bg-blue-500' },
  { name: 'الإدارة', percentage: 20, color: 'bg-emerald-500' },
  { name: 'المالية', percentage: 15, color: 'bg-amber-500' },
  { name: 'الموارد البشرية', percentage: 10, color: 'bg-rose-500' },
];

/* ─── ألوان الدونت ─── */
export const DONUT_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e'];

/* ─── أداء الموظفين ─── */
export const PERFORMANCE_BREAKDOWN = [
  { label: 'أداء ممتاز', value: '72%', color: 'bg-emerald-500' },
  { label: 'أداء جيد', value: '20%', color: 'bg-amber-500' },
  { label: 'يحتاج تحسين', value: '8%', color: 'bg-red-500' },
];
