import { UserTitle } from '@prisma/client';

export interface EnrollmentRequest {
  lastName: string;
  firstName: string;
  title: UserTitle;
  institution?: string;
  phone?: string;
  email?: string;
  formTemplateId: string;
  fieldValues: FieldValue[];
}

export interface FieldValue {
  fieldTemplateId: string;
  value: string;
}

export interface EnrollmentResponse {
  user: {
    id: string;
    uuidCode: string;
    lastName: string;
    firstName: string;
    title: UserTitle;
    institution?: string;
    phone?: string;
    email?: string;
  };
  message: string;
}