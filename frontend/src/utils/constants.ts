// Constantes frontend

// URL de base de l'API
export const API_BASE_URL = 'http://localhost:5000';

// Endpoints API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  SETUP: {
    ORGANIZATIONS: '/api/setup/organizations',
    STATS: '/api/setup/stats',
  },
  ADMIN: {
    STATS: '/api/admin/stats',
    ACTIVITY: '/api/admin/activity',
  },
  FORMS: '/api/forms',
  USERS: '/api/admin/users',
  PRESENCE: '/api/presence',
  ENROLLMENT: '/api/enrollment',
} as const;

// Champs système disponibles pour les formulaires d'enregistrement
export const SYSTEM_FIELDS = [
  {
    key: 'lastName',
    label: 'Nom',
    fieldType: 'TEXT' as const,
    isRequired: true,
    description: 'Nom de famille du visiteur'
  },
  {
    key: 'firstName',
    label: 'Prénoms',
    fieldType: 'TEXT' as const,
    isRequired: true,
    description: 'Prénoms du visiteur'
  },
  {
    key: 'title',
    label: 'Titre/Profession',
    fieldType: 'SELECT' as const,
    isRequired: true,
    description: 'Titre ou profession du visiteur',
    options: ['ETUDIANT', 'PROFESSIONNEL', 'ELEVE', 'AUTRE']
  },
  {
    key: 'institution',
    label: 'École/Université/Entreprise',
    fieldType: 'TEXT' as const,
    isRequired: false,
    description: 'École, université ou entreprise d\'origine'
  },
  {
    key: 'phone',
    label: 'Téléphone',
    fieldType: 'TEXT' as const,
    isRequired: false,
    description: 'Numéro de téléphone'
  },
  {
    key: 'email',
    label: 'Email',
    fieldType: 'TEXT' as const,
    isRequired: false,
    description: 'Adresse email'
  }
];

export type SystemFieldKey = typeof SYSTEM_FIELDS[number]['key'];