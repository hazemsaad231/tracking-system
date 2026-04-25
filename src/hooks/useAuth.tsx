import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Login_api, Forgot_api, Reset_api} from '../api/api.ts';
import { success, Error as toastError } from '../components/ui/toast.tsx';
import { useAuthContext } from '../context/AuthContext';


export const useAuth = () => {


  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  // التعامل مع الأخطاء 
  const handleError = (error: any) => {
  console.log("Error Response:", error);

  if (!error.response) {
    toastError(error.message || "حدث خطأ ما، حاول مرة أخرى");
    return;
  }

  const message = Array.isArray(error.response?.data?.message)
    ? error.response.data.message[0]
    : error.response?.data?.message;

    console.log("Extracted Error Message:", message);

  toastError(message || "حدث خطأ ما حاول مرة أخرى");
};




  // 1. تسجيل الدخول
  const login = async (data: any) => {
  setLoading(true);
  try {
    const response = await apiClient.post(Login_api, data);
    const Data = response?.data;

    console.log("Login Response Data:", Data); // ✅ تحقق من البيانات المستلمة من الخادم
    console.log("User Data:", Data?.data?.user); // ✅ تحقق من وجود بيانات المستخدم
    console.log("Token:", Data?.data?.token); // ✅ تحقق من وجود التوكن

    // ✅ تأكد إن الـ response فيه user و token
    if (!Data || !Data.data?.user || !Data.data?.token) {
      throw new Error("استجابة غير متوقعة من الخادم");
    }

    const userData = {
      id: Data.data.user.id,
      name: Data.data.user.name,
      email: Data.data.user.email,
      phone: Data.data.user.phone,
      role: Data.data.user.roles[0]
    }

    setUser(userData);
    localStorage.setItem('token', Data.data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    success("تم تسجيل الدخول بنجاح");
    setTimeout(() => navigate("/dashboard"), 500);

  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};



  // 2. نسيان كلمة المرور
  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await apiClient.post(Forgot_api, { email });
      success("تم إرسال رمز التحقق بنجاح");
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. تعيين كلمة مرور جديدة
  
  const resetPassword = async (data: any) => {
    setLoading(true);
    try {
      await apiClient.post(Reset_api, data);
      success("تم تغيير كلمة المرور بنجاح");
      navigate("/login");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };



  return {
    login,
    forgotPassword,
    resetPassword,
    loading
  };
};




  // 2. إنشاء حساب جديد
//   const Register = async (data: any): Promise<boolean> => {
//     setLoading(true);
//     try {
//       await axios.post(Register_api, data);
//       success("تم إنشاء الحساب بنجاح! تم إرسال بيانات حسابك إلى بريدك الإلكتروني 📧" );
//       return true;
//     } catch (error) {
//       handleError(error);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };


