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
  };
  admin: {
    id: string;
    username: string;
    role: string;
  };
  credentials: {
    username: string;
    password: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  active: boolean;
  createdAt: string;
  adminCount: number;
  userCount: number;
}