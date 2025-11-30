import { FormType, FieldType } from '@prisma/client';

export interface CreateFormRequest {
  name: string;
  description?: string;
  type: FormType;
  active?: boolean;
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  type?: FormType;
  active?: boolean;
}

export interface CreateFieldRequest {
  label: string;
  fieldType: FieldType;
  isRequired?: boolean;
  options?: string[];
  order?: number;
}

export interface UpdateFieldRequest {
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