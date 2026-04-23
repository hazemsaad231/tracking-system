import {
  LayoutDashboard,
  BarChart3,
  Settings,
  UserCheck,
  Users,
  MapPin,
  ClipboardList,
  Bell,
} from 'lucide-react';
import { createElement } from 'react';
import type { NavSection, PageMeta } from '@/types';

/* ─── أقسام الشريط الجانبي ─── */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'الرئيسية',
    items: [
      {
        label: 'نظرة عامة',
        path: '/dashboard/overview',
        icon: createElement(LayoutDashboard, { size: 20 }),
      },
      {
        label: 'التحليلات',
        path: '/dashboard/analytics',
        icon: createElement(BarChart3, { size: 20 }),
      },
    ],
  },
  {
    title: 'الإدارة',
    items: [
      {
        label: 'الموظفين',
        path: '/dashboard/employees',
        icon: createElement(UserCheck, { size: 20 }),
        badge: 24,
      },
      {
        label: 'العملاء',
        path: '/dashboard/clients',
        icon: createElement(Users, { size: 20 }),
        badge: 156,
      },
      {
        label: 'التتبع المباشر',
        path: '/dashboard/tracking',
        icon: createElement(MapPin, { size: 20 }),
      },
      {
        label: 'المهام',
        path: '/dashboard/tasks',
        icon: createElement(ClipboardList, { size: 20 }),
        badge: 8,
      },
    ],
  },
  {
    title: 'النظام',
    items: [
      {
        label: 'الإشعارات',
        path: '/dashboard/notifications',
        icon: createElement(Bell, { size: 20 }),
        badge: 5,
      },
      {
        label: 'الإعدادات',
        path: '/dashboard/settings',
        icon: createElement(Settings, { size: 20 }),
      },
    ],
  },
];

/* ─── عناوين الصفحات ─── */
export const PAGE_TITLES: Record<string, PageMeta> = {
  '/dashboard/overview': {
    title: 'نظرة عامة',
    subtitle: 'ملخص أداء النظام وحالة الموظفين والعملاء',
  },
  '/dashboard/users': {
    title: 'إدارة المستخدمين',
    subtitle: 'إدارة جميع المستخدمين',
  },
  '/dashboard/roles': {
    title: 'إدارة الأدوار',
    subtitle: 'متابعة وإدارة جميع الأدوار',
  },
  '/dashboard/permissions': {
    title: 'إدارة الصلاحيات',
    subtitle: 'متابعة وإدارة جميع الصلاحيات',
  },
  '/dashboard/tracking': {
    title: 'التتبع المباشر',
    subtitle: 'تتبع الموظفين والعملاء في الوقت الحقيقي',
  },
  '/dashboard/tasks': {
    title: 'المهام',
    subtitle: 'إدارة وتوزيع المهام على الموظفين',
  },
  '/dashboard/notifications': {
    title: 'الإشعارات',
    subtitle: 'آخر التنبيهات والتحديثات',
  },
  '/dashboard/settings': {
    title: 'الإعدادات',
    subtitle: 'إعدادات النظام والحساب',
  },
};

/* ─── العنوان الافتراضي ─── */
export const DEFAULT_PAGE_META: PageMeta = {
  title: 'لوحة التحكم',
  subtitle: 'مرحباً بك في لوحة تحكم المسؤول',
};
