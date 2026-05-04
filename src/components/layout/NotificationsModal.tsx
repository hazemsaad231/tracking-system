import React, { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from "@/pages/notifications/api";
import type { AppNotification, NotificationsApiResponse } from "@/pages/notifications/type";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking inside the modal, do nothing
      if (modalRef.current && modalRef.current.contains(event.target as Node)) {
        return;
      }
      
      // If clicking the bell button (which is handled by the parent), do nothing here
      const target = event.target as Element;
      if (target.closest('[aria-label="الإشعارات"]')) {
        return;
      }
      
      if (isOpen) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<NotificationsApiResponse>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: isOpen, // Only fetch when modal is open
  });

  const notifications = data?.data || [];
  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      toast.success("تم تحديد كل الإشعارات كمقروءة");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      toast.success("تم حذف الإشعار بنجاح");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  if (!isOpen) return null;

  return (
      <div 
        ref={modalRef}
        className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-fit min-w-[280px] max-w-[400px] max-h-[80vh] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 z-50 flex flex-col animate-in fade-in slide-in-from-top-4 duration-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">الإشعارات</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {unreadCount > 0 ? `لديك ${unreadCount} إشعارات غير مقروءة` : 'لا توجد إشعارات جديدة'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Actions Bar */}
        {unreadCount > 0 && (
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 shrink-0 flex justify-end">
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors text-xs font-medium"
            >
              <CheckCheck size={14} />
              <span>تحديد الكل كمقروء</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500 text-sm">حدث خطأ أثناء تحميل الإشعارات</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-base font-medium text-slate-700 dark:text-slate-300 mb-1">لا توجد إشعارات</h3>
              <p className="text-slate-500 text-sm">ليس لديك أي إشعارات في الوقت الحالي.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {notifications.map((notification: AppNotification) => {
                const isUnread = !notification.read_at;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 flex gap-4 transition-colors relative group ${
                      isUnread
                        ? "bg-purple-50/50 dark:bg-purple-500/5"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                          )}
                          <h4 className={`text-sm font-semibold truncate ${
                            isUnread ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                          }`}>
                            {notification.title || "إشعار جديد"}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(notification.created_at).toLocaleDateString('ar-EG', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed pr-4">
                        {notification.message}
                      </p>
                    </div>

                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex">
                      {isUnread && (
                        <button
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          title="تحديد كمقروء"
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 dark:hover:text-emerald-400 transition-colors"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(notification.id)}
                        disabled={deleteMutation.isPending}
                        title="حذف الإشعار"
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <Link
            to="/dashboard/notifications"
            onClick={onClose}
            className="w-full flex items-center justify-center py-2.5 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 rounded-xl transition-colors"
          >
            عرض كل الإشعارات
          </Link>
        </div>
      </div>
  );
};

export default NotificationsModal;
