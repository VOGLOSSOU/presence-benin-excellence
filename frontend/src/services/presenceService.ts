import { apiService, ApiResponse } from './api';

// Types pour les présences
export interface PresenceRecord {
  id: string;
  tenantId: string;
  userId: string;
  formTemplateId: string;
  presenceType: 'ARRIVAL' | 'DEPARTURE' | 'SIMPLE';
  timestamp: string;
  user?: {
    uuidCode: string;
    firstName: string;
    lastName: string;
  };
  formTemplate?: {
    name: string;
    type: string;
  };
}

export interface RecordPresenceRequest {
  uuidCode: string;
  formTemplateId: string;
}

export interface RecordPresenceResponse {
  presence: PresenceRecord;
  message: string;
}

// Service de gestion des présences
export class PresenceService {
  private api = apiService;

  /**
   * Enregistrer une présence
   */
  async recordPresence(presenceData: RecordPresenceRequest): Promise<RecordPresenceResponse> {
    const response = await this.api.post<RecordPresenceResponse>('/api/presence', presenceData);
    return response.data!;
  }

  /**
   * Récupérer l'historique des présences d'un utilisateur
   */
  async getUserPresences(uuid: string): Promise<PresenceRecord[]> {
    const response = await this.api.get<PresenceRecord[]>(`/api/presence/${uuid}`);
    return response.data || [];
  }

  /**
   * Récupérer toutes les présences de l'organisation
   */
  async getAllPresences(): Promise<PresenceRecord[]> {
    const response = await this.api.get<{ data: PresenceRecord[] }>('/presence');
    return response.data?.data || [];
  }

  /**
   * Récupérer les présences d'aujourd'hui
   */
  async getTodayPresences(): Promise<PresenceRecord[]> {
    const today = new Date().toISOString().split('T')[0];
    const allPresences = await this.getAllPresences();
    return allPresences.filter(presence =>
      presence.timestamp.startsWith(today)
    );
  }

  /**
   * Récupérer les présences par période
   */
  async getPresencesByPeriod(startDate: string, endDate: string): Promise<PresenceRecord[]> {
    const allPresences = await this.getAllPresences();
    return allPresences.filter(presence => {
      const presenceDate = presence.timestamp.split('T')[0];
      return presenceDate >= startDate && presenceDate <= endDate;
    });
  }

  /**
   * Récupérer les présences par type
   */
  async getPresencesByType(type: 'ARRIVAL' | 'DEPARTURE' | 'SIMPLE'): Promise<PresenceRecord[]> {
    const allPresences = await this.getAllPresences();
    return allPresences.filter(presence => presence.presenceType === type);
  }

  /**
   * Statistiques des présences
   */
  async getPresenceStats() {
    const allPresences = await this.getAllPresences();
    const todayPresences = await this.getTodayPresences();

    const stats = {
      totalPresences: allPresences.length,
      todayPresences: todayPresences.length,
      arrivals: allPresences.filter(p => p.presenceType === 'ARRIVAL').length,
      departures: allPresences.filter(p => p.presenceType === 'DEPARTURE').length,
      simplePresences: allPresences.filter(p => p.presenceType === 'SIMPLE').length,
      uniqueUsersToday: new Set(todayPresences.map(p => p.userId)).size,
      averageDailyPresences: Math.round(allPresences.length / 30) // Approximation sur 30 jours
    };

    return stats;
  }

  /**
   * Vérifier si un utilisateur a déjà marqué sa présence aujourd'hui
   */
  async hasUserCheckedInToday(uuid: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const userPresences = await this.getUserPresences(uuid);

    return userPresences.some(presence =>
      presence.timestamp.startsWith(today)
    );
  }

  /**
   * Récupérer la dernière présence d'un utilisateur
   */
  async getLastUserPresence(uuid: string): Promise<PresenceRecord | null> {
    const userPresences = await this.getUserPresences(uuid);
    if (userPresences.length === 0) return null;

    // Trier par timestamp décroissant
    userPresences.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return userPresences[0];
  }

  /**
   * Calculer le temps de présence d'un utilisateur pour une journée
   */
  async getUserPresenceTimeToday(uuid: string): Promise<number | null> {
    const today = new Date().toISOString().split('T')[0];
    const userPresences = await this.getUserPresences(uuid);

    const todayPresences = userPresences
      .filter(p => p.timestamp.startsWith(today))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (todayPresences.length < 2) return null;

    const firstPresence = todayPresences[0];
    const lastPresence = todayPresences[todayPresences.length - 1];

    if (firstPresence.presenceType === 'ARRIVAL' && lastPresence.presenceType === 'DEPARTURE') {
      const arrivalTime = new Date(firstPresence.timestamp).getTime();
      const departureTime = new Date(lastPresence.timestamp).getTime();
      return departureTime - arrivalTime; // en millisecondes
    }

    return null;
  }
}

// Instance par défaut
export const presenceService = new PresenceService();