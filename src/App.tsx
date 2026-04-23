import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/Forgot-password';
import ResetPassword from './pages/auth/Reset-Password';
import Overview from './pages/admin_dashboard/overview/Overview';
import NotFound from './pages/notfound/NotFound';
import Settings from './pages/admin_dashboard/settings/Settings';
import DashboardLayout from './components/layout/DashboardLayout';
import Users from './pages/admin_dashboard/users/Users';
import Roles from './pages/admin_dashboard/roles/Roles';
import Permissions from './pages/admin_dashboard/permissions/Permissions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {

  const queryClient = new QueryClient();
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          }
        >
          <Route path="overview" element={<Overview />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="permissions" element={<Permissions />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
