import type React from 'react';

/* ─── عنصر التنقل ─── */
export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

/* ─── قسم التنقل ─── */
export interface NavSection {
  title: string;
  items: NavItem[];
}

/* ─── عناوين الصفحات ─── */
export interface PageMeta {
  title: string;
  subtitle: string;
}
