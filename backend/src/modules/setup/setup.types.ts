export interface CreateOrganizationRequest {
  organizationName: string;
  adminUsername: string;
  adminPassword: string;
  adminEmail?: string;
}

export interface CreateOrganizationResponse {
  tenant: {
    id: string;
    name: string;
    code: string;
    description?: string;
    active: boolean;
    createdAt: string;
  };
  admin: {
    id: string;
    username: string;
    role: string;
    tenantId: string;
  };
  token?: string; // Optionnel car pas retourné quand SYSTEM_ADMIN crée une org
}

export interface SystemStats {
  totalOrganizations: number;
  totalUsers: number;
  totalPresences: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}