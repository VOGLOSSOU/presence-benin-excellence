import { ProfileType } from '@/types/user.types';
import { PresenceType } from '@/types/presence.types';

export const API_BASE_URL = 'http://localhost:5000';

export const COLORS = {
  PRIMARY: '#1877F2',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  GRAY: '#6B7280',
} as const;

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  [ProfileType.STUDENT]: 'Étudiant',
  [ProfileType.PROFESSIONAL]: 'Professionnel',
  [ProfileType.PUPIL]: 'Élève',
  [ProfileType.OTHER]: 'Autre',
};

export const PRESENCE_TYPE_LABELS: Record<PresenceType, string> = {
  [PresenceType.SIMPLE]: 'Présence simple',
  [PresenceType.ARRIVAL_DEPARTURE]: 'Arrivée/Départ',
};

export const UUID_PATTERN = /^BE-[A-Z0-9]{7}$/;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  SETUP: {
    CREATE_ORGANIZATION: '/api/setup/organization',
    GET_ORGANIZATIONS: '/api/setup/organizations',
  },
  FORMS: {
    LIST: '/api/forms',
    CREATE: '/api/forms',
    GET_BY_ID: (id: string) => `/api/forms/${id}`,
    UPDATE: (id: string) => `/api/forms/${id}`,
    DELETE: (id: string) => `/api/forms/${id}`,
    ADD_FIELD: (id: string) => `/api/forms/${id}/fields`,
    CREATE_INTERVAL: (id: string) => `/api/forms/${id}/interval`,
  },
  ENROLLMENT: {
    REGISTER: '/api/enrollment',
  },
  PRESENCE: {
    MARK: '/api/presence',
    HISTORY: (uuid: string) => `/api/presence/${uuid}`,
  },
} as const;