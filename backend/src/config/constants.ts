// Constantes globales de l'application

export const UUID_PREFIX = 'BE-';
export const UUID_LENGTH = 7; // Longueur du code après "BE-"

export const TENANT_CODE_PREFIX = 'BE-';

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_SALT_ROUNDS = 10;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  ISO: 'ISO',
};

export const MESSAGES = {
  // Success
  SUCCESS: 'Operation successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  
  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  
  // User
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_UUID: 'Invalid UUID code',
  UUID_NOT_FOUND: 'UUID code not found',
  
  // Form
  FORM_NOT_FOUND: 'Form template not found',
  FIELD_NOT_FOUND: 'Field template not found',
  FORM_INACTIVE: 'Form template is inactive',
  
  // Presence
  PRESENCE_RECORDED: 'Presence recorded successfully',
  ALREADY_CHECKED_IN: 'Already checked in today',
  ALREADY_CHECKED_OUT: 'Already checked out today',
  NO_CHECK_IN: 'No check-in record found for today',
  
  // Generic errors
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Champs système disponibles pour les formulaires d'enregistrement
export const SYSTEM_FIELDS = {
  lastName: {
    key: 'lastName',
    label: 'Nom',
    fieldType: 'TEXT' as const,
    isRequired: true,
    description: 'Nom de famille du visiteur'
  },
  firstName: {
    key: 'firstName',
    label: 'Prénoms',
    fieldType: 'TEXT' as const,
    isRequired: true,
    description: 'Prénoms du visiteur'
  },
  title: {
    key: 'title',
    label: 'Titre/Profession',
    fieldType: 'SELECT' as const,
    isRequired: true,
    description: 'Titre ou profession du visiteur',
    options: ['ETUDIANT', 'PROFESSIONNEL', 'ELEVE', 'AUTRE']
  },
  institution: {
    key: 'institution',
    label: 'École/Université/Entreprise',
    fieldType: 'TEXT' as const,
    isRequired: false,
    description: 'École, université ou entreprise d\'origine'
  },
  phone: {
    key: 'phone',
    label: 'Téléphone',
    fieldType: 'TEXT' as const,
    isRequired: false,
    description: 'Numéro de téléphone'
  },
  email: {
    key: 'email',
    label: 'Email',
    fieldType: 'TEXT' as const,
    isRequired: false,
    description: 'Adresse email'
  }
} as const;

export type SystemFieldKey = keyof typeof SYSTEM_FIELDS;