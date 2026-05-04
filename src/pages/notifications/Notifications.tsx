import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from "./api";
import type { AppNotification, NotificationsApiResponse } from "./type";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<NotificationsApiResponse>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const notifications = data?.data || [];

  console.log(notifications);
  

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 rounded-2xl border border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
            حدث خطأ أثناء التحميل
          </p>
          <p className="text-red-400 dark:text-red-300/60 text-sm mt-1">
            {(error as Error).message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Bell size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">الإشعارات</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                لديك {notifications.filter(n => !n.read_at).length} إشعارات غير مقروءة
              </p>
            </div>
          </div>

          {notifications.some(n => !n.read_at) && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors text-sm font-medium"
            >
              <CheckCheck size={16} />
              <span>تحديد الكل كمقروء</span>
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/60 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">جاري التحميل...</div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">لا توجد إشعارات</h3>
              <p className="text-slate-500 dark:text-slate-500 text-sm">ليس لديك أي إشعارات في الوقت الحالي.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {notifications.map((notification: AppNotification) => {
                const isUnread = !notification.read_at;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                      isUnread
                        ? "bg-purple-50/50 dark:bg-purple-500/5 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                        : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                        )}
                        <h4 className={`text-sm font-semibold truncate ${
                          isUnread ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                        }`}>
                          {notification?.title || "إشعار جديد"}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {notification?.message}
                      </p>
                      <span className="block mt-2 text-xs text-slate-400 dark:text-slate-500 font-mono">
                        {new Date(notification.created_at).toLocaleString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUnread && (
                        <button
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          title="تحديد كمقروء"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(notification.id)}
                        disabled={deleteMutation.isPending}
                        title="حذف الإشعار"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;