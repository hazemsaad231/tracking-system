// navConfig.tsx أو في نفس الملف فوق
import { House, Users, Shield, Wrench, Layers} from 'lucide-react';
import type { UserRole } from '../../context/AuthContext';
import type { JSX } from 'react';


const NAVIGATION_MAP: Record<UserRole, { label: string; items: { label: string; icon: JSX.Element; path: string }[] }> = {
  admin: {
    label: 'المسؤول',
    items: [
      { label: 'الرئيسية', icon: <House size={18} />, path: '/dashboard/overview' },
      { label: 'المستخدمين', icon: <Users size={18} />, path: '/dashboard/users' },
      { label: 'الأدوار', icon: <Shield size={18} />, path: '/dashboard/roles' },
      { label: 'الصلاحيات', icon: <Shield size={18} />, path: '/dashboard/permissions' },
      { label: 'الفئات', icon: <Layers size={18} />, path: '/dashboard/categories' },
      { label: 'الإعدادات', icon: <Wrench size={18} />, path: '/dashboard/settings' },
    ]
  },
  accountant: {
    label: 'المحاسب',
    items: [
      { label: 'الاحصائيات', icon: <House size={18} />, path: '/dashboard/accountant' },
      { label: 'الإعدادات', icon: <Wrench size={18} />, path: '/dashboard/settings' },
    ]
  },
  reviewer: {
    label: 'المراجع',
    items: [
      { label: 'الرئيسية', icon: <House size={18} />, path: '/dashboard/reviewer' },
      { label: 'الإعدادات', icon: <Wrench size={18} />, path: '/dashboard/settings' },
    ],
  },
  writer: {
    label: 'الكاتب',
    items: [
      { label: 'الرئيسية', icon: <House size={18} />, path: '/dashboard/writer' },
      { label: 'الإعدادات', icon: <Wrench size={18} />, path: '/dashboard/settings' },
    ],
  },
  client: {
    label: 'العميل',
    items: [
      { label: 'الرئيسية', icon: <House size={18} />, path: '/dashboard/client' },
      { label: 'الإعدادات', icon: <Wrench size={18} />, path: '/dashboard/settings' },
    ],
  },

};

export default NAVIGATION_MAP;