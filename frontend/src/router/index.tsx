import { Routes, Route, Navigate } from 'react-router-dom';
import { SystemAdminGuard, SuperAdminGuard, AdminGuard } from './guards';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage';

// Setup pages (System Admin only)
import OrganizationSetupPage from '@/pages/setup/OrganizationSetupPage';

// Admin pages (Super Admin + Manager)
import DashboardPage from '@/pages/admin/DashboardPage';
import FormsPage from '@/pages/admin/FormsPage';
import UsersPage from '@/pages/admin/UsersPage';
import ReportsPage from '@/pages/admin/ReportsPage';

// Visitor pages (Public)
import HomePage from '@/pages/visitor/HomePage';
import RegistrationPage from '@/pages/visitor/RegistrationPage';
import PresencePage from '@/pages/visitor/PresencePage';

// Shared pages
import NotFoundPage from '@/pages/shared/NotFoundPage';
import MaintenancePage from '@/pages/shared/MaintenancePage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Visitor routes (public) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/presence" element={<PresencePage />} />

      {/* System Admin routes */}
      <Route
        path="/setup/*"
        element={
          <SystemAdminGuard>
            <Routes>
              <Route path="/" element={<OrganizationSetupPage />} />
            </Routes>
          </SystemAdminGuard>
        }
      />

      {/* Super Admin routes */}
      <Route
        path="/admin/*"
        element={
          <SuperAdminGuard>
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </SuperAdminGuard>
        }
      />

      {/* Shared routes */}
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;