import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';

const roleRoutes: Record<UserRole, string> = {
  admin: '/dashboard/overview',
  accountant: '/dashboard/accountant',
  reviewer: '/dashboard/reviewer',
  writer: '/dashboard/writer',
  client: '/dashboard/client',
};

const Dashboard = () => {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/" replace />;

  const route = roleRoutes[user.role] || '/dashboard/overview';
  return <Navigate to={route} replace />;
};

export default Dashboard;