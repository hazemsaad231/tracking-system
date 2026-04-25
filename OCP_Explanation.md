# شرح مبدأ Open/Closed Principle (OCP)

مبدأ Open/Closed هو أحد المبادئ الخمسة الأساسية في تصميم البرمجيات (SOLID). ينص المبدأ على:

> "يجب أن تكون الوحدات البرمجية (Classes, Modules, Functions) مفتوحة للتوسع (Open for extension)، ومغلقة للتعديل (Closed for modification)."

ببساطة، هذا يعني أنه يجب أن تكون قادرًا على إضافة وظائف جديدة لنظامك دون تغيير الكود الموجود بالفعل.

---

## مثال عملي: `AuthContext`

لنرى كيف تم تطبيق هذا المبدأ في ملف `AuthContext.tsx` الذي قمنا بتعديله.

### الطريقة القديمة (تنتهك مبدأ OCP)

في الإصدار القديم من الكود (الذي كان مُعطلاً)، كان لدينا شيء مشابه لهذا:

```typescript
// ...
interface AuthContextType {
  user: User | null;
  // ...
  isAdmin: () => boolean;
  isClient: () => boolean; // لو أضفنا دور جديد، سنحتاج لإضافة دالة جديدة
}

const AuthProvider = ({ children }) => {
  // ...
  const isAdmin = () => user?.role === 'admin';
  const isClient = () => user?.role === 'client'; // وتعديل هنا

  return (
    <AuthContext.Provider value={{ user, isAdmin, isClient }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**المشكلة:** لو أردنا إضافة دور جديد مثل `accountant`، سنضطر إلى:
1.  تعديل `AuthContextType` وإضافة `isAccountant`.
2.  تعديل `AuthProvider` وإضافة دالة `isAccountant` جديدة.
3.  تعديل `value` في `Provider`.

هذا يعني أننا نعدل الكود الموجود، مما يخالف مبدأ "مغلق للتعديل".

### الطريقة الجديدة (تتبع مبدأ OCP)

في الإصدار الحالي والمُحسَّن، أصبح الكود كالتالي:

```typescript
// 1. الأدوار مُعرفة في مكان واحد ومرن
export type UserRole = 'admin' | 'accountant' | 'reviewer' | 'writer' | 'client';

interface AuthContextType {
  user: User | null;
  // ...
  // 2. دالة واحدة عامة للتحقق من أي دور
  hasRole: (role: UserRole) => boolean;
}

const AuthProvider = ({ children }) => {
  // ...
  // 3. منطق التحقق لا يعتمد على أدوار معينة
  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**الميزة:** الآن، إذا أردنا إضافة دور جديد مثل `supervisor`:
1.  كل ما علينا فعله هو تحديث `UserRole` فقط:
    `export type UserRole = 'admin' | 'accountant' | ... | 'supervisor';`

لا نحتاج إلى لمس أو تعديل أي سطر في `AuthContext` أو `AuthProvider`. لقد قمنا **بتوسيع** وظائف النظام (بإضافة دور جديد) دون **تعديل** الكود الأساسي المسؤول عن التحقق من الصلاحيات.

هذا يجعل الكود أكثر قابلية للصيانة، وأقل عرضة للأخطاء، وأسهل في التطوير على المدى الطويل.
