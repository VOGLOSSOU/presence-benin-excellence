// Types globaux réutilisables

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface TimeInterval {
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
}