import { FormType, FieldType, FormPurpose } from '@prisma/client';

export interface CreateFormTemplateRequest {
  name: string;
  description?: string;
  purpose: FormPurpose;
  type?: FormType; // Optionnel pour ENROLLMENT
  fields: CreateFieldTemplateRequest[];
  intervals?: CreateIntervalRequest[];
}

export interface UpdateFormTemplateRequest {
  name?: string;
  description?: string;
  purpose?: FormPurpose;
  type?: FormType;
  active?: boolean;
}

export interface CreateFieldTemplateRequest {
  label: string;
  fieldType: FieldType;
  isRequired?: boolean;
  options?: string[];
  order?: number;
}

export interface UpdateFieldTemplateRequest {
  label?: string;
  fieldType?: FieldType;
  isRequired?: boolean;
  options?: string[];
  order?: number;
}

export interface CreateIntervalRequest {
  startTime: string;
  endTime: string;
}

export interface FormTemplateResponse {
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
  fields: FieldTemplateResponse[];
  intervals?: IntervalResponse[];
}

export interface FieldTemplateResponse {
  id: string;
  formTemplateId: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  options?: string[];
  order: number;
}

export interface IntervalResponse {
  id: string;
  formTemplateId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}