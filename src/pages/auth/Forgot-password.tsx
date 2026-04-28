import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
    const { forgotPassword, loading } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (data: any) => {
        const success = await forgotPassword(data.email);
        if (success) {
            navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
        }
    };

    /* ─── Helper: Input classes (same as Login) ─── */
    const inputBase = 'w-full pl-10 py-3 text-sm bg-white border border-white focus:ring-violet-500/30 focus:border-violet-500/60 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400';
    const inputError = 'border-red-500/60 focus:ring-red-500/30';

    return (
        <AuthLayout>
            <>
                {/* العنوان */}
                <div className="text-center mb-7">
                    <h1 className="text-2xl font-bold text-white mb-2">نسيت كلمة المرور</h1>
                    <p className="text-gray-200 text-sm w-60 m-auto">أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق (OTP) لاستعادة حسابك</p>
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
                                className={`${errors.email ? `${inputBase} ${inputError}` : inputBase}`}
                                placeholder="name@example.com"
                                dir="ltr"
                            />
                        </div>
                        {errors.email && <span className="text-red-500 dark:text-red-400 text-xs font-medium block">{errors.email.message as string}</span>}
                    </div>

                    {/* زر إرسال رمز التحقق */}
                    <div className="!my-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[--two-color] hover:brightness-90 w-full py-3.5 mt-2 text-sm font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-[--one-color]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    جاري الإرسال...
                                </>
                            ) : (
                                'إرسال رمز التحقق (OTP)'
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

export default ForgotPassword;
