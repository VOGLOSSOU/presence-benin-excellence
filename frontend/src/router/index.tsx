import { Routes, Route, Navigate } from 'react-router-dom';
import { SystemAdminGuard, SuperAdminGuard, AdminGuard } from './guards';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import SystemLoginPage from '@/pages/auth/SystemLoginPage';
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage';

// Setup pages (System Admin only)
import OrganizationSetupPage from '@/pages/setup/OrganizationSetupPage';

// System pages (System Admin only)
import SystemDashboardPage from '@/pages/system/SystemDashboardPage';

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
      <Route path="/system/login" element={<SystemLoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Organization visitor routes (public with org context) */}
      <Route path="/org/:orgCode" element={<HomePage />} />
      <Route path="/org/:orgCode/register" element={<RegistrationPage />} />
      <Route path="/org/:orgCode/presence" element={<PresencePage />} />

      {/* Legacy routes - redirect to org */}
      <Route path="/register" element={<Navigate to="/org/default/register" replace />} />
      <Route path="/presence" element={<Navigate to="/org/default/presence" replace />} />

      {/* Root route - Super Admin Dashboard */}
      <Route
        path="/"
        element={
          <SuperAdminGuard>
            <DashboardPage />
          </SuperAdminGuard>
        }
      />

      {/* System Admin routes */}
      <Route
        path="/system/*"
        element={
          <SystemAdminGuard>
            <Routes>
              <Route path="/dashboard" element={<SystemDashboardPage />} />
            </Routes>
          </SystemAdminGuard>
        }
      />

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