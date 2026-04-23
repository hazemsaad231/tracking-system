import type React from 'react';

/* ─── ألوان المكونات ─── */
export type CardColor = 'violet' | 'blue' | 'emerald' | 'amber' | 'rose';

/* ─── بطاقة الإحصائيات ─── */
export interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: CardColor;
}

/* ─── حالات الموظفين ─── */
export type EmployeeStatus = 'active' | 'onLeave' | 'remote' | 'inactive';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  lastSeen: string;
}

/* ─── حالات العملاء ─── */
export type ClientStatus = 'active' | 'new' | 'vip' | 'suspended';

export interface Client {
  id: string;
  name: string;
  company: string;
  assignedTo: string;
  status: ClientStatus;
  lastContact: string;
}

/* ─── سجل الأنشطة ─── */
export type ActivityType = 'success' | 'warning' | 'info';

export interface Activity {
  id: number;
  message: string;
  time: string;
  type: ActivityType;
}

/* ─── بيانات الرسم البياني ─── */
export interface ChartDataPoint {
  label: string;
  value: number;
}

/* ─── بيانات التوزيع (Donut) ─── */
export interface DistributionItem {
  name: string;
  percentage: number;
  color: string;
}

/* ─── مؤشرات الأداء ─── */
export interface KpiCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  gradient: string;
}

/* ─── عناصر الأداء الدائري ─── */
export interface PerformanceItem {
  label: string;
  value: string;
  color: string;
}
