import { API_BASE_URL } from '@/utils/constants';

// Types de base pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  timestamp: string;
  response?: {
    data: any;
    status: number;
  };
}

// Classe de base pour les services API
export class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Récupérer le token depuis le localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Headers par défaut
  private getDefaultHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Méthode générique pour les requêtes GET
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        // Créer une erreur avec la réponse complète pour préserver les détails de validation
        const error = new Error(data.message || 'Erreur lors de la requête') as any;
        error.response = { data, status: response.status };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  // Méthode générique pour les requêtes POST
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getDefaultHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        // Créer une erreur avec la réponse complète pour préserver les détails de validation
        const error = new Error(data.message || 'Erreur lors de la requête') as any;
        error.response = { data, status: response.status };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  // Méthode générique pour les requêtes PUT
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getDefaultHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        // Créer une erreur avec la réponse complète pour préserver les détails de validation
        const error = new Error(data.message || 'Erreur lors de la requête') as any;
        error.response = { data, status: response.status };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  }

  // Méthode générique pour les requêtes DELETE
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getDefaultHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        // Créer une erreur avec la réponse complète pour préserver les détails de validation
        const error = new Error(data.message || 'Erreur lors de la requête') as any;
        error.response = { data, status: response.status };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
}

// Instance par défaut
export const apiService = new ApiService();