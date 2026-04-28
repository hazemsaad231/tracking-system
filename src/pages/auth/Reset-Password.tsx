import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Hash, Loader2, ArrowRight } from 'lucide-react';
import AuthLayout from './AuthLayout';

const ResetPassword = () => {
    const { resetPassword, loading } = useAuth();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const urlEmail = searchParams.get('email') || '';
    const urlToken = searchParams.get('token') || '';

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: urlEmail,
            token: urlToken,
            password: '',
            password_confirmation: ''
        }
    });

    const onSubmit = async (data: any) => {
        await resetPassword(data);
    };

    /* ─── Helper: Input classes (same as Login) ─── */
    const inputBase = 'w-full pl-10 py-3 text-sm bg-white border border-white focus:ring-violet-500/30 focus:border-violet-500/60 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400';
    const inputError = 'border-red-500/60 focus:ring-red-500/30';
    const inputWithEye = 'w-full pr-11 pl-11 py-3 text-sm bg-white border border-white focus:ring-violet-500/30 focus:border-violet-500/60 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400';

    return (
        <AuthLayout>
            <>
                {/* العنوان */}
                <div className="text-center mb-7">
                    <h1 className="text-2xl font-bold text-white mb-2">تعيين كلمة المرور</h1>
                    <p className="text-gray-200 text-sm w-60 m-auto">أدخل كلمة المرور الجديدة لحسابك</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* البريد الإلكتروني */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white block">البريد الإلكتروني</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Mail size={18} className="text-gray-700" />
                            </div>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "البريد الإلكتروني مطلوب",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "يرجى إدخال بريد إلكتروني صحيح"
                                    }
                                })}
                                className={`${errors.email ? `${inputBase} ${inputError}` : inputBase} ${urlEmail ? 'opacity-60 cursor-not-allowed' : ''}`}
                                placeholder="name@example.com"
                                dir="ltr"
                                readOnly={!!urlEmail}
                            />
                        </div>
                        {errors.email && <span className="text-red-500 dark:text-red-400 text-xs font-medium block">{errors.email.message as string}</span>}
                    </div>

                    {/* كلمة المرور الجديدة */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white block">كلمة المرور الجديدة</label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Lock size={18} className="text-gray-700" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "كلمة المرور مطلوبة",
                                    minLength: { value: 6, message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }
                                })}
                                className={`${errors.password ? `${inputWithEye} ${inputError}` : inputWithEye}`}
                                placeholder="••••••••"
                                dir="ltr"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 transition-colors focus:outline-none"
                                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="text-red-500 dark:text-red-400 text-xs font-medium block">{errors.password.message as string}</span>}
                    </div>

                    {/* تأكيد كلمة المرور */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white block">تأكيد كلمة المرور</label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ShieldCheck size={18} className="text-gray-700" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("password_confirmation", {
                                    required: "يرجى تأكيد كلمة المرور",
                                    validate: (val: string) => {
                                        if (watch('password') != val) {
                                            return "كلمات المرور غير متطابقة";
                                        }
                                    }
                                })}
                                className={`${errors.password_confirmation ? `${inputWithEye} ${inputError}` : inputWithEye}`}
                                placeholder="••••••••"
                                dir="ltr"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 transition-colors focus:outline-none"
                                aria-label={showConfirmPassword ? "إخفاء" : "إظهار"}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password_confirmation && <span className="text-red-500 dark:text-red-400 text-xs font-medium block">{errors.password_confirmation.message as string}</span>}
                    </div>

                    {/* رمز التحقق */}
                    {!urlToken && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white block">رمز التحقق (OTP)</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Hash size={18} className="text-gray-700" />
                                </div>
                                <input
                                    type="text"
                                    {...register("token", { required: "رمز التحقق مطلوب" })}
                                    className={`${errors.token ? `${inputBase} ${inputError}` : inputBase}`}
                                    placeholder="أدخل الرمز المرسل لك"
                                    dir="ltr"
                                />
                            </div>
                            {errors.token && <span className="text-red-500 dark:text-red-400 text-xs font-medium block">{errors.token.message as string}</span>}
                        </div>
                    )}

                    {/* زر التحديث */}
                    <div className="!my-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[--two-color] hover:brightness-90 w-full py-3.5 mt-2 text-sm font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-[--one-color]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    جاري التحديث...
                                </>
                            ) : (
                                'تحديث كلمة المرور'
                            )}
                        </button>
                    </div>
                </form>

                {/* رابط العودة */}
                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-200 hover:text-white transition-colors font-medium"
                    >
                        <ArrowRight size={14} />
                        العودة لتسجيل الدخول
                    </Link>
                </div>
            </>
        </AuthLayout>
    );
};

export default ResetPassword;
