import { apiService, ApiResponse } from './api';

// Types pour le setup
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

// Service de configuration système
export class SetupService {
  private api = apiService;

  /**
   * Créer une nouvelle organisation avec son premier admin
   */
  async createOrganization(orgData: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    const response = await this.api.post<CreateOrganizationResponse>('/api/setup/organization', orgData);

    // Le backend ne retourne un token que si nécessaire (pas pour SYSTEM_ADMIN)
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data!;
  }

  /**
   * Récupérer toutes les organisations (admin système uniquement)
   */
  async getAllOrganizations(): Promise<any[]> {
    console.log('🔍 [SetupService] getAllOrganizations - Appel API...');
    const response = await this.api.get<any[]>('/api/setup/organizations');
    console.log('📡 [SetupService] getAllOrganizations - Réponse brute:', response);
    console.log('📦 [SetupService] getAllOrganizations - response.data:', response.data);
    return response.data || [];
  }

  /**
   * Récupérer les statistiques globales du système
   */
  async getSystemStats(): Promise<SystemStats> {
    const response = await this.api.get<SystemStats>('/api/setup/stats');
    return response.data || {
      totalOrganizations: 0,
      totalUsers: 0,
      totalPresences: 0,
      systemHealth: 'healthy'
    };
  }

  /**
   * Désactiver une organisation
   */
  async deactivateOrganization(tenantId: string): Promise<void> {
    await this.api.put(`/api/setup/organizations/${tenantId}/deactivate`);
  }

  /**
   * Réactiver une organisation
   */
  async activateOrganization(tenantId: string): Promise<void> {
    await this.api.put(`/api/setup/organizations/${tenantId}/activate`);
  }

  /**
   * Supprimer une organisation (dangereux)
   */
  async deleteOrganization(tenantId: string): Promise<void> {
    await this.api.delete(`/api/setup/organizations/${tenantId}`);
  }

  /**
   * Reset le mot de passe d'un admin
   */
  async resetAdminPassword(adminId: string, newPassword: string): Promise<void> {
    await this.api.put(`/api/setup/admins/${adminId}/reset-password`, { newPassword });
  }

  /**
   * Vérifier la santé du système
   */
  async checkSystemHealth(): Promise<{
    database: boolean;
    api: boolean;
    timestamp: string;
  }> {
    const response = await this.api.get('/health');
    return {
      database: true, // À implémenter côté backend
      api: response.success,
      timestamp: response.timestamp || new Date().toISOString()
    };
  }

  /**
   * Générer un rapport système complet
   */
  async generateSystemReport(): Promise<Blob> {
    const response = await fetch(`${this.api['baseURL']}/api/setup/report`, {
      method: 'GET',
      headers: this.api['getDefaultHeaders'](),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération du rapport');
    }

    return response.blob();
  }

  /**
   * Récupérer les statistiques de l'organisation (pour les admins)
   */
  async getOrganizationStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalPresences: number;
    todayPresences: number;
    totalForms: number;
    activeForms: number;
  }> {
    const response = await this.api.get<{
      totalUsers: number;
      activeUsers: number;
      totalPresences: number;
      todayPresences: number;
      totalForms: number;
      activeForms: number;
    }>('/api/admin/stats');

    return response.data || {
      totalUsers: 0,
      activeUsers: 0,
      totalPresences: 0,
      todayPresences: 0,
      totalForms: 0,
      activeForms: 0,
    };
  }

  /**
   * Récupérer l'activité récente de l'organisation
   */
  async getRecentActivity(): Promise<any[]> {
    const response = await this.api.get<{ data: any[] }>('/api/admin/activity');
    return response.data?.data || [];
  }

  /**
   * Récupérer les informations d'un tenant
   */
  async getTenantInfo(tenantId: string): Promise<{ id: string; name: string; code: string }> {
    const response = await this.api.get<{ id: string; name: string; code: string }>(`/api/setup/tenants/${tenantId}`);
    return response.data!;
  }

  /**
   * Récupérer une organisation par son code (public)
   */
  async getTenantByCode(code: string): Promise<{ id: string; name: string; code: string; active: boolean }> {
    const response = await this.api.get<{ id: string; name: string; code: string; active: boolean }>(`/api/setup/tenants/by-code/${code}`);
    return response.data!;
  }
}

// Instance par défaut
export const setupService = new SetupService();