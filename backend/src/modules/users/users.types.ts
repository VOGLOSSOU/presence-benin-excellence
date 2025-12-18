import { UserTitle, UserStatus } from '@prisma/client';

export interface CreateUserRequest {
  lastName: string;
  firstName: string;
  title: UserTitle;
  phone?: string;
  email?: string;
}

export interface UpdateUserRequest {
  lastName?: string;
  firstName?: string;
  title?: UserTitle;
  phone?: string;
  email?: string;
  status?: UserStatus;
}

export interface UserResponse {
  id: string;
  tenantId: string;
  uuidCode: string;
  lastName: string;
  firstName: string;
  title: UserTitle;
  phone?: string;
  email?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  presencesCount: number;
}