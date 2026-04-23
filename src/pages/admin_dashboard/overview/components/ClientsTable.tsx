import React from 'react';
import { Eye } from 'lucide-react';
import type { Client, ClientStatus } from '@/types';
import { CLIENT_STATUS_CONFIG } from '@/constants';

interface ClientsTableProps {
  clients: Client[];
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  title = 'آخر العملاء',
  subtitle = 'قائمة العملاء في النظام',
  onViewAll,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium flex items-center gap-1 transition-colors">
            <Eye size={14} />
            عرض الكل
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b border-slate-100 dark:border-slate-800">
              <th className="text-right text-xs font-medium text-slate-400 px-6 py-3">الكود</th>
              <th className="text-right text-xs font-medium text-slate-400 px-6 py-3">العميل</th>
              <th className="text-right text-xs font-medium text-slate-400 px-6 py-3 hidden sm:table-cell">الشركة</th>
              <th className="text-right text-xs font-medium text-slate-400 px-6 py-3 hidden md:table-cell">المسؤول</th>
              <th className="text-right text-xs font-medium text-slate-400 px-6 py-3">الحالة</th>
              <th className="text-right text-xs font-medium text-slate-400 px-6 py-3 hidden lg:table-cell">آخر تواصل</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const cfg = CLIENT_STATUS_CONFIG[client.status as ClientStatus];
              return (
                <tr key={client.id} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <td className="px-6 py-3.5"><span className="text-sm font-mono font-medium text-violet-600 dark:text-violet-400">{client.id}</span></td>
                  <td className="px-6 py-3.5"><span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{client.name}</span></td>
                  <td className="px-6 py-3.5 hidden sm:table-cell"><span className="text-sm text-slate-500">{client.company}</span></td>
                  <td className="px-6 py-3.5 hidden md:table-cell"><span className="text-sm text-slate-500">{client.assignedTo}</span></td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 hidden lg:table-cell"><span className="text-xs text-slate-400">{client.lastContact}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;
