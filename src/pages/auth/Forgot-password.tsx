import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import logo from '../../assets/logo.png';

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
    const inputBase = 'w-full md:w-[400px] pl-10 py-3 text-sm bg-white border border-white focus:ring-violet-500/30 focus:border-violet-500/60 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400';
    const inputError = 'border-red-500/60 focus:ring-red-500/30';

    return (
        <div className="flex min-h-screen items-center justify-center w-full relative overflow-hidden px-4 bg-[--one-color]">
            {/* تأثيرات بصرية للخلفية */}
            <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-violet-600/10 dark:bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] bg-blue-600/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] bg-violet-500/5 dark:bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex flex-col gap-5 justify-center items-center w-full relative z-10">
                {/* اللوجو */}
                <div className="w-[280px] h-max flex items-center justify-center">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>

                {/* الكارد */}
                <div className="p-4">
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
                                className="bg-[--two-color] hover:brightness-90 w-full md:w-[400px] py-3.5 mt-2 text-sm font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-[--one-color]"
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
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
