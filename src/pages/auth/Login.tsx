import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import AuthLayout from './AuthLayout';

const Login = () => {
    const { login, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: any) => {
        await login(data);
    };

    return (
        <AuthLayout>
                {/* العنوان */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
                    <p className="text-gray-600 text-sm w-60 m-auto">مرحباً بعودتك! أدخل بياناتك للوصول إلى لوحة التحكم</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* البريد الإلكتروني */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium block">
                            البريد الإلكتروني
                        </label>
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
                                className={`w-full pl-10 py-3 text-sm bg-slate-100 border border-slate-200  focus:ring-violet-500/30 focus:border-violet-500/60 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400 `}
                                placeholder="name@example.com"
                                dir='ltr'
                            />
                        </div>
                        {errors.email && (
                            <span className="text-red-500 dark:text-red-400 text-xs font-medium block">
                                {errors.email.message as string}
                            </span>
                        )}
                    </div>

                    {/* كلمة المرور */}
                    <div className="space-y-2">

                        <label className="text-sm font-medium block">
                            كلمة المرور
                        </label>

                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                <Lock size={18} className="text-gray-700" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "كلمة المرور مطلوبة",
                                    minLength: {
                                        value: 6,
                                        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                                    }
                                })}
                                className={`w-full pr-11 pl-11 py-3 text-sm bg-slate-100 border border-slate-200 focus:ring-violet-500/30 focus:border-violet-500/60 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400`}
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
                        {errors.password && (
                            <span className="text-red-500 dark:text-red-400 text-xs font-medium block">
                                {errors.password.message as string}
                            </span>
                        )}
                        <div className='my-3 flex items-center justify-between w-full'>

                            <Link
                                to="/forgot-password"
                                className="text-xs font-medium"
                            >
                                نسيت كلمة المرور؟
                            </Link>


                        </div>
                    </div>


                    {/* زر تسجيل الدخول */}
                    <div className='!mt-8'>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[--two-color] hover:brightness-90 w-full py-3.5 mt-2 text-sm font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-[--one-color]"

                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    جاري الدخول...
                                </>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>
                    </div>


                </form>
        </AuthLayout>
    );
};

export default Login;