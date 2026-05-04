import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  FolderKanban,
  Settings2,
  BarChart3,
  ScanEye,
  PenLine,
  UserCircle2,
} from 'lucide-react';
import type { UserRole } from '../../context/AuthContext';
import type { JSX } from 'react';

const NAVIGATION_MAP: Record<UserRole, { label: string; items: { label: string; icon: JSX.Element; path: string; children?: { label: string; path: string }[] }[] }> = {
  admin: {
    label: 'المسؤول',
    items: [
      { label: 'الرئيسية',     icon: <LayoutDashboard size={18} />, path: '/dashboard/overview' },
      { 
        label: 'المستخدمين', 
        icon: <Users size={18} />, 
        path: '/dashboard/users',
        children: [
          { label: 'كل المستخدمين', path: '/dashboard/users' },
          { label: 'العملاء',      path: '/dashboard/users?role=client' },
          { label: 'المحاسبين',    path: '/dashboard/users?role=accountant' },
          { label: 'المراجعين',    path: '/dashboard/users?role=reviewer' },
          { label: 'الكتّاب',      path: '/dashboard/users?role=writer' },
        ]
      },
      { label: 'الأدوار',      icon: <ShieldCheck size={18} />,     path: '/dashboard/roles' },
      { label: 'الصلاحيات',    icon: <KeyRound size={18} />,        path: '/dashboard/permissions' },
      { label: 'النشاط',       icon: <FolderKanban size={18} />,    path: '/dashboard/categories' },
      // { label: 'الإشعارات',     icon: <Bell size={18} />,          path: '/dashboard/notifications' },
      { label: 'الإعدادات',    icon: <Settings2 size={18} />,       path: '/dashboard/settings' },
    ],
  },

  accountant: {
    label: 'المحاسب',
    items: [
      { label: 'الاحصائيات', icon: <BarChart3 size={18} />,  path: '/dashboard/accountant' },
      { label: 'الإعدادات',  icon: <Settings2 size={18} />,  path: '/dashboard/settings' },
    ],
  },
  reviewer: {
    label: 'المراجع',
    items: [
      { label: 'الرئيسية',  icon: <ScanEye size={18} />,   path: '/dashboard/reviewer' },
      { label: 'الإعدادات', icon: <Settings2 size={18} />, path: '/dashboard/settings' },
    ],
  },
  writer: {
    label: 'الكاتب',
    items: [
      { label: 'الرئيسية',  icon: <PenLine size={18} />,   path: '/dashboard/writer' },
      { label: 'الإعدادات', icon: <Settings2 size={18} />, path: '/dashboard/settings' },
    ],
  },
  client: {
    label: 'العميل',
    items: [
      { label: 'الرئيسية',  icon: <UserCircle2 size={18} />, path: '/dashboard/client' },
      { label: 'الإعدادات', icon: <Settings2 size={18} />,   path: '/dashboard/settings' },
    ],
  },
};

export default NAVIGATION_MAP;