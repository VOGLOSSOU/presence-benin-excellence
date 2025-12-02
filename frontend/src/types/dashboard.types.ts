export interface DashboardStats {
  totalUsers: number;
  totalPresences: number;
  activeForms: number;
  todayPresences: number;
}

export interface RecentActivity {
  id: string;
  type: 'presence' | 'registration' | 'form_created';
  description: string;
  timestamp: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}