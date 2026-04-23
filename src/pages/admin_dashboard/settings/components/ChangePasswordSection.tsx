import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { success, Error as toastError } from '../../../../components/ui/toast';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const changePassword = async (data: any) => {
  const response = await apiClient.post('/auth/change-password', data);
  return response.data;
};

const ChangePasswordSection: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      success('تم تغيير كلمة المرور بنجاح');
      reset();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'حدث خطأ ما';
      toastError(message);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center gap-3 p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
          <Lock size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">تغيير كلمة المرور</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">تأكد من اختيار كلمة مرور قوية لتأمين حسابك.</p>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
              كلمة المرور الحالية
            </label>
            <div className="relative">
              <Lock size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                dir="ltr"
                type={showCurrentPassword ? 'text' : 'password'}
                {...register('current_password', { required: 'كلمة المرور الحالية مطلوبة' })}
                className={`w-full pr-11 pl-11 py-3 text-sm bg-slate-50/50 dark:bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.current_password ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-200 dark:border-slate-700 focus:ring-violet-500/30 focus:border-violet-500'
                  }`}
              />
              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.current_password && <span className="text-red-500 text-xs mt-1">{errors.current_password.message as string}</span>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Lock size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                dir="ltr"
                type={showNewPassword ? 'text' : 'password'}
                {...register('password', { required: 'كلمة المرور الجديدة مطلوبة', minLength: { value: 8, message: 'يجب أن تكون 8 أحرف على الأقل' } })}
                className={`w-full pr-11 pl-11 py-3 text-sm bg-slate-50/50 dark:bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-200 dark:border-slate-700 focus:ring-violet-500/30 focus:border-violet-500'
                  }`}
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message as string}</span>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Lock size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                dir="ltr"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('password_confirmation', { required: 'تأكيد كلمة المرور مطلوب' })}
                className={`w-full pr-11 pl-11 py-3 text-sm bg-slate-50/50 dark:bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password_confirmation ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-200 dark:border-slate-700 focus:ring-violet-500/30 focus:border-violet-500'
                  }`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password_confirmation && <span className="text-red-500 text-xs mt-1">{errors.password_confirmation.message as string}</span>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 className="animate-spin w-5 h-5 ml-2" /> : 'تحديث كلمة المرور'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordSection;
