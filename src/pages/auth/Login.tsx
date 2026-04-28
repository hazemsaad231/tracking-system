import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

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
        <div
            className="flex min-h-screen items-center justify-center w-full relative overflow-hidden px-4 bg-[--one-color]"
        >
            {/* تأثيرات بصرية للخلفية */}
            <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-violet-600/10 dark:bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] bg-blue-600/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] bg-violet-500/5 dark:bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex flex-col gap-5 justify-center items-center w-full relative z-10">
                {/* اللوجو */}
                <div className="w-[240px] md:w-[280px] h-max flex items-center justify-center">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>

                {/* الكارد */}
                <div className=" p-4">
                    {/* العنوان */}
                    <div className="text-center mb-7">
                        <h1 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h1>
                        <p className="text-gray-200 text-sm w-60 m-auto">مرحباً بعودتك! أدخل بياناتك للوصول إلى لوحة التحكم</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* البريد الإلكتروني */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white block">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none">
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
                                    className={`w-full md:w-[450px] pl-10 py-3 text-sm bg-white border border-white  focus:ring-violet-500/30 focus:border-violet-500/60 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400 `}
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
                           
                                <label className="text-sm font-medium text-white block">
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
                                    className={`w-full md:w-[450px] pr-11 pl-11 py-3 text-sm bg-white border border-white focus:ring-violet-500/30 focus:border-violet-500/60 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400`}
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
                          <div className='my-3 flex items-center justify-between w-full md:w-[450px]'>

                              <Link
                                    to="/forgot-password"
                                    className="text-xs font-medium text-white transition-colors hover:text-white/80"
                                >
                                    نسيت كلمة المرور؟
                                </Link>
                                
                                {/* ذكرني */}
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                   
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="remember-me"
                                            className="sr-only peer"
                                        />
                                        <div className="w-4 h-4 bg-white/20 border-2 border-white/60 rounded peer-checked:bg-white peer-checked:border-white transition-all"></div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                                            <svg className="w-2.5 h-2.5 text-[--one-color]" fill="none" viewBox="0 0 12 10">
                                                <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-white">ذكرني</span>
                                </label>

                              
                            </div>
                        </div>


                        {/* زر تسجيل الدخول */}
                        <div className='!my-10'>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[--two-color] hover:bg-[--two-color/80] w-full py-3.5 mt-2 text-sm font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[var(--two-color)/30] hover:-translate-y-0.5 active:translate-y-0"

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
                </div>
            </div>
        </div>
    );
};

export default Login;
