import { apiService } from './api';

export type FormPurpose = 'ENROLLMENT' | 'PRESENCE';
export type FormType = 'SIMPLE_PRESENCE' | 'ARRIVAL_DEPARTURE';
export type FieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'CHECKBOX' | 'TEXTAREA';

export interface FormTemplate {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  purpose: FormPurpose;
  type?: FormType; // Optionnel pour ENROLLMENT
  active: boolean;
  createdAt: string;
  updatedAt: string;
  fieldsCount: number;
  usagesCount: number;
  fields: FieldTemplate[];
  intervals?: Interval[];
}

export interface FieldTemplate {
  id: string;
  formTemplateId: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  options?: string[];
  order: number;
}

export interface Interval {
  id: string;
  formTemplateId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface CreateFormRequest {
  name: string;
  description?: string;
  purpose: FormPurpose;
  type?: FormType; // Optionnel pour ENROLLMENT
  fields: CreateFieldRequest[];
  intervals?: CreateIntervalRequest[];
}

export interface CreateFieldRequest {
  label: string;
  fieldType: FieldType;
  isRequired?: boolean;
  options?: string[];
  order?: number;
}

export interface CreateIntervalRequest {
  startTime: string;
  endTime: string;
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  purpose?: FormPurpose;
  type?: FormType;
  active?: boolean;
}

/**
 * Récupérer tous les formulaires de l'organisation
 */
export const getAllForms = async (): Promise<FormTemplate[]> => {
  const response = await apiService.get<FormTemplate[]>('/api/admin/forms');
  return response.data!;
};

/**
 * Récupérer un formulaire par ID
 */
export const getFormById = async (formId: string): Promise<FormTemplate> => {
  const response = await apiService.get<FormTemplate>(`/api/admin/forms/${formId}`);
  return response.data!;
};

/**
 * Créer un nouveau formulaire
 */
export const createForm = async (data: CreateFormRequest): Promise<FormTemplate> => {
  const response = await apiService.post<FormTemplate>('/api/admin/forms', data);
  return response.data!;
};

/**
 * Mettre à jour un formulaire
 */
export const updateForm = async (formId: string, data: UpdateFormRequest): Promise<FormTemplate> => {
  const response = await apiService.put<FormTemplate>(`/api/admin/forms/${formId}`, data);
  return response.data!;
};

/**
 * Supprimer un formulaire
 */
export const deleteForm = async (formId: string): Promise<void> => {
  await apiService.delete(`/api/admin/forms/${formId}`);
};

/**
 * Activer/Désactiver un formulaire
 */
export const toggleFormStatus = async (formId: string): Promise<FormTemplate> => {
  const response = await apiService.put<FormTemplate>(`/api/admin/forms/${formId}/toggle-status`);
  return response.data!;
};

/**
 * Récupérer les formulaires actifs d'une organisation (pour les visiteurs)
 */
export const getPublicForms = async (tenantId: string): Promise<{
  id: string;
  name: string;
  description?: string;
  type?: FormType;
  purpose: FormPurpose;
  createdAt: string;
}[]> => {
  const response = await apiService.get<{
    id: string;
    name: string;
    description?: string;
    type?: FormType;
    purpose: FormPurpose;
    createdAt: string;
  }[]>(`/api/forms/public/${tenantId}`);
  return response.data!;
};

export const formService = {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  toggleFormStatus,
  getPublicForms,
};