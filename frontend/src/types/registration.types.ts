import { ProfileType, User } from './user.types';

export interface DynamicFormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'date';
  required: boolean;
  placeholder?: string;
  options?: string[]; // Pour les select
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'minLength' | 'maxLength' | 'pattern' | 'email';
  value: string | number;
  message: string;
}

export interface RegistrationFormConfig {
  profileType: ProfileType;
  fields: DynamicFormField[];
}

export interface RegistrationRequest {
  lastName: string;
  firstName: string;
  profileType: ProfileType;
  dynamicFields: Record<string, any>;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  uuid: string;
  user: User;
}