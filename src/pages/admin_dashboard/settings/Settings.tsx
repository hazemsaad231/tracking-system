import { User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ChangePasswordSection from './components/ChangePasswordSection';
import SettingsSkeleton from './components/SettingsSkeleton';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}

const fetchProfile = async (): Promise<ApiResponse> => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};

// ─── Main Component ────────────────────────────────────────────────────────────

const Settings: React.FC = () => {
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const profileData = data?.data;

  const settingsSections = [
    {
      title: 'الحساب',
      icon: <User size={20} />,
      items: [
        { label: 'الاسم الكامل', value: profileData?.name || 'غير متوفر', type: 'text' as const },
        { label: 'البريد الإلكتروني', value: profileData?.email || 'غير متوفر', type: 'text' as const },
        { label: 'رقم الهاتف', value: profileData?.phone || 'غير متوفر', type: 'text' as const },
      ],
    },

  ];

  if (isLoading) return <SettingsSkeleton />;
  if (error) return <div>حدث خطأ: {error.message}</div>;
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500 max-w-6xl m-auto">
        {settingsSections.map((section, sIdx) => (
          <div
            key={sIdx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
          >
            <div className="flex items-center  gap-3 p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                {section.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {section.title}
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {section.items.map((item: any, iIdx: number) => (
                <div
                  key={iIdx}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>

                  {item.type === 'text' && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {item.value as string}
                    </span>
                  )}

                  {item.type === 'toggle' && (
                    <button
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${item.value
                          ? 'bg-violet-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${item.value ? 'left-0.5' : 'right-0.5'
                          }`}
                      />
                    </button>
                  )}

                  {item.type === 'action' && (
                    <button
                      onClick={item.onClick}
                      className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium px-3 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                    >
                      تعديل
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── Change Password Inline Section ── */}
        <ChangePasswordSection />
      </div>
    </>
  );
};

export default Settings;
