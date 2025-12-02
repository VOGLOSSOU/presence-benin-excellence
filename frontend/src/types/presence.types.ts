export enum PresenceType {
  SIMPLE = 'simple',
  ARRIVAL_DEPARTURE = 'arrivee_depart'
}

export enum PresenceStatus {
  ARRIVAL = 'arrivee',
  DEPARTURE = 'depart',
  PRESENT = 'present'
}

export interface PresenceRecord {
  id: string;
  userId: string;
  uuid: string;
  type: PresenceType;
  status: PresenceStatus;
  timestamp: Date;
  date: string; // Format: YYYY-MM-DD
}

export interface PresenceConfig {
  type: PresenceType;
  startTime?: string; // Format: HH:mm
  endTime?: string;   // Format: HH:mm
}

export interface MarkPresenceRequest {
  uuid: string;
}

export interface MarkPresenceResponse {
  success: boolean;
  message: string;
  presence: PresenceRecord;
  user: {
    firstName: string;
    lastName: string;
  };
}