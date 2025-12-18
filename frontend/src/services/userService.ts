import { apiService } from './api';

export interface User {
  id: string;
  uuidCode: string;
  lastName: string;
  firstName: string;
  title: string;
  phone?: string;
  email?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  presencesCount: number;
}

export interface CreateUserRequest {
  lastName: string;
  firstName: string;
  title: string;
  phone?: string;
  email?: string;
}

export interface UpdateUserRequest {
  lastName?: string;
  firstName?: string;
  title?: string;
  phone?: string;
  email?: string;
  status?: string;
}

/**
 * Récupérer tous les utilisateurs de l'organisation
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiService.get<User[]>('/api/admin/users');
  return response.data!;
};

/**
 * Récupérer un utilisateur par ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  const response = await apiService.get<User>(`/api/admin/users/${userId}`);
  return response.data!;
};

/**
 * Créer un nouvel utilisateur
 */
export const createUser = async (data: CreateUserRequest): Promise<User> => {
  const response = await apiService.post<User>('/api/admin/users', data);
  return response.data!;
};

/**
 * Mettre à jour un utilisateur
 */
export const updateUser = async (userId: string, data: UpdateUserRequest): Promise<User> => {
  const response = await apiService.put<User>(`/api/admin/users/${userId}`, data);
  return response.data!;
};

/**
 * Supprimer un utilisateur
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await apiService.delete(`/api/admin/users/${userId}`);
};

/**
 * Activer/Désactiver un utilisateur
 */
export const toggleUserStatus = async (userId: string): Promise<User> => {
  const response = await apiService.put<User>(`/api/admin/users/${userId}/toggle-status`);
  return response.data!;
};

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
};