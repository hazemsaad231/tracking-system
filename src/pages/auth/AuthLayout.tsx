import type { ReactNode } from 'react';
import bgImage from '../../assets/bg.png';
import logo from '../../assets/logo2.png';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div
            className="flex min-h-screen items-center justify-center w-full relative overflow-hidden"
        >

               {/* Color Overlay */}
            <div className="absolute inset-0 w-full h-full bg-[--one-color] opacity-98" />
            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            />


            <div className="flex flex-col gap-5 justify-center items-center w-full m-4 md:w-[480px] rounded-xl px-4 py-6 relative z-10 bg-white text-[--one-color] shadow-2xl shadow-black/5 border border-white ">
                {/* Logo */}
                <div className="w-[110px] md:w-[130px] h-max flex items-center justify-center">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>

                {/* Page Content */}
                <div className="p-2 w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
