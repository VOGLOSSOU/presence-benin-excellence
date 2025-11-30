import { AdminRole } from '@prisma/client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: AdminRole;
}

export interface AuthResponse {
  admin: {
    id: string;
    username: string;
    role: AdminRole;
  };
  token: string;
}