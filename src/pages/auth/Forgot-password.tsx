import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Loader2, ArrowRight } from 'lucide-react';

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
        // We'll pass the email to forgotPassword
        const success = await forgotPassword(data.email);
        if (success) {
            // After sending OTP, navigate to reset password page with email in URL
            navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
        }
    };

    /* ─── Helper: Input classes ─── */
    const inputBase = 'w-full pr-11 pl-4 py-3 text-sm bg-slate-50/50 dark:bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500';
    const inputNormal = 'border-slate-200 dark:border-slate-600/50 focus:ring-violet-500/30 focus:border-violet-500/60';
    const inputError = 'border-red-500/60 focus:ring-red-500/30';

    return (
        <div
            className="flex min-h-screen items-center justify-center w-full relative overflow-hidden px-4 bg-slate-50 dark:bg-[#0f172a] bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#0f172a]"
        >
            {/* تأثيرات بصرية للخلفية */}
            <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-violet-600/10 dark:bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] bg-blue-600/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] bg-violet-500/5 dark:bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[420px] relative z-10">
                {/* اللوجو */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                        <KeyRound size={32} className="text-white" />
                    </div>
                </div>

                {/* الكارد */}
                <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-2xl dark:shadow-2xl rounded-2xl p-7 sm:p-8">
                    {/* العنوان */}
                    <div className="text-center mb-7">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">نسيت كلمة المرور</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق (OTP) لاستعادة حسابك</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* البريد الإلكتروني */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">البريد الإلكتروني</label>
                            <div className="relative">
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                                    <Mail size={18} />
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
                                    className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                                    placeholder="name@example.com"
                                    dir="ltr"
                                />
                            </div>
                            {errors.email && <span className="text-red-500 dark:text-red-400 text-xs font-medium block">{errors.email.message as string}</span>}
                        </div>

                        {/* زر إرسال رمز التحقق */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 mt-1 text-sm font-bold rounded-xl text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)' }}
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
                    </form>

                    {/* رابط العودة */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium"
                        >
                            <ArrowRight size={14} />
                            العودة لتسجيل الدخول
                        </Link>
                    </div>
                </div>

                {/* نص تحت الكارد */}
                <p className="text-center text-slate-500 dark:text-slate-500 text-xs mt-6">
                    نظام التتبع — لوحة تحكم المسؤول
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
