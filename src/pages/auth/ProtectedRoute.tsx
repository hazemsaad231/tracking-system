// components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';

interface Props {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { user } = useAuthContext();

  // مش logged in
  if (!user) return <Navigate to="/" replace />;

  // مش عنده الـ role الصح
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;