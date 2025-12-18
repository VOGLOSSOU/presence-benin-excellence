import { apiService, ApiResponse } from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api.types';

// Types pour les réponses d'authentification
export interface LoginResponse extends AuthResponse {}
export interface RegisterResponse extends AuthResponse {}

// Service d'authentification
export class AuthService {
  private api = apiService;

  /**
   * Connexion d'un administrateur
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

    // Sauvegarder le token dans le localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data!;
  }

  /**
   * Inscription d'un nouvel administrateur
   */
  async register(adminData: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, adminData);

    // Sauvegarder le token dans le localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data!;
  }

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      // Optionnel : appeler l'API de logout si elle existe
      // await this.api.post('/auth/logout');
    } finally {
      // Toujours supprimer le token localement
      localStorage.removeItem('token');
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Récupérer le token actuel
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Vérifier la validité du token (optionnel)
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      // TODO: Implémenter un endpoint de validation si nécessaire
      // const response = await this.api.get('/auth/validate');
      // return response.success;

      return true; // Temporaire
    } catch {
      return false;
    }
  }
}

// Instance par défaut
export const authService = new AuthService();