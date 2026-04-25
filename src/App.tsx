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
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/auth/ProtectedRoute';
import AccountantDashboard from './pages/accountant_dashboard/Accountant';
import ReviewerDashboard from './pages/reviewer_dashboard/Reviewer';
import WriterDashboard from './pages/writer_dashboard/Writer';
import ClientDashboard from './pages/client_dashboard/Client';




  const queryClient = new QueryClient();


function App() {

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
            <ProtectedRoute allowedRoles={['admin', 'accountant', 'reviewer', 'writer', 'client']}>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path='accountant' element={<AccountantDashboard />} />
          <Route path='reviewer' element={<ReviewerDashboard />} />
          <Route path='writer' element={<WriterDashboard />} />
          <Route path='client' element={<ClientDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
