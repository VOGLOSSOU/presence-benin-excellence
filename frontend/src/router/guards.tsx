import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AdminRole } from '@/types/user.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AdminRole[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo = "/login",
}) => {
  const { user, token, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Vérifier l'authentification
  if (requireAuth && !token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Vérifier les rôles
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export const SystemAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[AdminRole.SYSTEM_ADMIN]} redirectTo="/system/login">
    {children}
  </ProtectedRoute>
);

export const SuperAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[AdminRole.SUPER_ADMIN]}>
    {children}
  </ProtectedRoute>
);

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[AdminRole.SYSTEM_ADMIN, AdminRole.SUPER_ADMIN]}>
    {children}
  </ProtectedRoute>
);