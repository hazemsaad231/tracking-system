import apiClient from './axios';

export const Login_api = `/auth/login`;
export const Register_api = `/auth/register`;
export const Reset_api = `/auth/reset-password`;
export const Forgot_api = `/auth/forgot-password`;

export const getDashboardData = () => apiClient.get('/dashboard');



