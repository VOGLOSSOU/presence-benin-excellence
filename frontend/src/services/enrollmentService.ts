import { apiService, ApiResponse } from './api';

// Types pour l'enregistrement des visiteurs
export interface EnrollmentRequest {
  lastName: string;
  firstName: string;
  title: 'ETUDIANT' | 'PROFESSIONNEL' | 'ELEVE' | 'AUTRE';
  phone?: string;
  email?: string;
  formTemplateId: string;
  fieldValues: Array<{
    fieldTemplateId: string;
    value: string;
  }>;
}

export interface EnrollmentResponse {
  user: {
    id: string;
    uuidCode: string;
    lastName: string;
    firstName: string;
    title: string;
    phone?: string;
    email?: string;
    createdAt: string;
    fieldValues: Array<{
      id: string;
      fieldTemplateId: string;
      value: string;
      createdAt: string;
    }>;
  };
  message: string;
}

// Service d'enregistrement des visiteurs
export class EnrollmentService {
  private api = apiService;

  /**
   * Enregistrer un nouveau visiteur
   * Endpoint public - pas besoin d'authentification
   */
  async enrollUser(enrollmentData: EnrollmentRequest): Promise<EnrollmentResponse> {
    // Pour l'enregistrement, on n'utilise pas le token JWT car c'est public
    const response = await fetch(`${this.api['baseURL']}/api/enrollment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrollmentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'enregistrement');
    }

    return data.data!;
  }

  /**
   * Vérifier si un UUID existe déjà
   * Note: Cette vérification se fait automatiquement côté backend lors de l'enrollment
   */
  async checkUUIDExists(uuid: string): Promise<boolean> {
    try {
      await this.getUserByUUID(uuid);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Récupérer les informations d'un visiteur par UUID
   * (Pour consultation publique)
   */
  async getUserByUUID(uuid: string): Promise<{
    id: string;
    uuidCode: string;
    firstName: string;
    lastName: string;
    title: string;
    createdAt: string;
  }> {
    const response = await fetch(`${this.api['baseURL']}/api/users/uuid/${uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Utilisateur non trouvé');
    }

    return data.data!;
  }

  /**
   * Récupérer l'historique des présences d'un visiteur
   * (Pour consultation publique)
   */
  async getUserPresenceHistory(uuid: string): Promise<Array<{
    id: string;
    presenceType: 'ARRIVAL' | 'DEPARTURE' | 'SIMPLE';
    timestamp: string;
    formTemplate: {
      name: string;
    };
  }>> {
    const response = await fetch(`${this.api['baseURL']}/api/presence/${uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la récupération de l\'historique');
    }

    return data.data || [];
  }
}

// Instance par défaut
export const enrollmentService = new EnrollmentService();