import { apiService, ApiResponse } from './api';

// Types pour les rapports
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPresences: number;
  todayPresences: number;
  totalForms: number;
  activeForms: number;
}

export interface WeeklyActivityData {
  day: string;
  presences: number;
  users: number;
}

export interface HourlyDistributionData {
  hour: string;
  presences: number;
}

export interface TopUser {
  name: string;
  presences: number;
  lastPresence: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  formId?: string;
  userId?: string;
  presenceType?: 'ARRIVAL' | 'DEPARTURE' | 'SIMPLE';
}

export interface DetailedReport {
  summary: {
    totalPresences: number;
    uniqueUsers: number;
    averagePerDay: number;
    mostActiveDay: string;
    peakHour: string;
  };
  dailyBreakdown: Array<{
    date: string;
    presences: number;
    users: number;
  }>;
  userStats: Array<{
    userId: string;
    userName: string;
    totalPresences: number;
    lastPresence: string;
  }>;
  formStats: Array<{
    formId: string;
    formName: string;
    totalPresences: number;
    uniqueUsers: number;
  }>;
}

// Service de rapports et statistiques
export class ReportService {
  private api = apiService;

  /**
   * Récupérer les statistiques du dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get<{ data: DashboardStats }>('/reports/dashboard');
    return response.data?.data || {
      totalUsers: 0,
      activeUsers: 0,
      totalPresences: 0,
      todayPresences: 0,
      totalForms: 0,
      activeForms: 0
    };
  }

  /**
   * Récupérer les données d'activité hebdomadaire
   */
  async getWeeklyActivity(): Promise<WeeklyActivityData[]> {
    const response = await this.api.get<{ data: WeeklyActivityData[] }>('/reports/weekly-activity');
    return response.data?.data || [];
  }

  /**
   * Récupérer la distribution horaire
   */
  async getHourlyDistribution(): Promise<HourlyDistributionData[]> {
    const response = await this.api.get<{ data: HourlyDistributionData[] }>('/reports/hourly-distribution');
    return response.data?.data || [];
  }

  /**
   * Récupérer les utilisateurs les plus actifs
   */
  async getTopUsers(limit: number = 5): Promise<TopUser[]> {
    const response = await this.api.get<{ data: TopUser[] }>(`/reports/top-users?limit=${limit}`);
    return response.data?.data || [];
  }

  /**
   * Générer un rapport détaillé avec filtres
   */
  async generateDetailedReport(filters: ReportFilters = {}): Promise<DetailedReport> {
    const queryParams = new URLSearchParams();

    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.formId) queryParams.append('formId', filters.formId);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.presenceType) queryParams.append('presenceType', filters.presenceType);

    const queryString = queryParams.toString();
    const endpoint = `/reports/detailed${queryString ? `?${queryString}` : ''}`;

    const response = await this.api.get<{ data: DetailedReport }>(endpoint);
    return response.data?.data!;
  }

  /**
   * Rapport journalier
   */
  async getDailyReport(date?: string): Promise<DetailedReport> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.generateDetailedReport({
      startDate: targetDate,
      endDate: targetDate
    });
  }

  /**
   * Rapport mensuel
   */
  async getMonthlyReport(year?: number, month?: number): Promise<DetailedReport> {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth();

    const startDate = new Date(targetYear, targetMonth, 1).toISOString().split('T')[0];
    const endDate = new Date(targetYear, targetMonth + 1, 0).toISOString().split('T')[0];

    return this.generateDetailedReport({
      startDate,
      endDate
    });
  }

  /**
   * Rapport par utilisateur
   */
  async getUserReport(userId: string, filters: Omit<ReportFilters, 'userId'> = {}): Promise<DetailedReport> {
    return this.generateDetailedReport({
      ...filters,
      userId
    });
  }

  /**
   * Rapport par formulaire
   */
  async getFormReport(formId: string, filters: Omit<ReportFilters, 'formId'> = {}): Promise<DetailedReport> {
    return this.generateDetailedReport({
      ...filters,
      formId
    });
  }

  /**
   * Exporter un rapport en CSV
   */
  async exportReport(filters: ReportFilters = {}, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('format', format);

    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.formId) queryParams.append('formId', filters.formId);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.presenceType) queryParams.append('presenceType', filters.presenceType);

    const queryString = queryParams.toString();
    const endpoint = `/reports/export${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(`${this.api['baseURL']}${endpoint}`, {
      method: 'GET',
      headers: this.api['getDefaultHeaders'](),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export du rapport');
    }

    return response.blob();
  }

  /**
   * Statistiques en temps réel
   */
  async getRealtimeStats(): Promise<{
    todayPresences: number;
    activeUsers: number;
    currentHourPresences: number;
    lastUpdate: string;
  }> {
    const response = await this.api.get<{
      todayPresences: number;
      activeUsers: number;
      currentHourPresences: number;
      lastUpdate: string;
    }>('/reports/realtime');
    return response.data || {
      todayPresences: 0,
      activeUsers: 0,
      currentHourPresences: 0,
      lastUpdate: new Date().toISOString()
    };
  }
}

// Instance par défaut
export const reportService = new ReportService();