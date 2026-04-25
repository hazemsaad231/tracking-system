


// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// // هذا هو الهوك الخاص بك
// export const useFetchData = (key: string, url: string) => {
//   return useQuery({
//     queryKey: [key, url],
//     queryFn: async () => {
//       const { data } = await axios.get(url);
//       return data;
//     },
//     // إعدادات إضافية اختيارية
//     staleTime: 1000 * 60 * 5, // البيانات تعتبر "طازجة" لمدة 5 دقائق
//   });
// };