import prisma from '../../config/database';
import {
  CreateFormTemplateRequest,
  UpdateFormTemplateRequest,
  FormTemplateResponse,
} from './forms.types';
import { FormType } from '@prisma/client';
import { BadRequestError } from '../../shared/errors';

/**
 * Récupérer tous les formulaires d'une organisation
 */
export const getAllFormTemplatesService = async (tenantId: string): Promise<FormTemplateResponse[]> => {
  const formTemplates = await prisma.formTemplate.findMany({
    where: { tenantId },
    include: {
      fields: {
        orderBy: { order: 'asc' },
      },
      intervals: true,
      _count: {
        select: {
          presences: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return formTemplates.map((form: any) => ({
    id: form.id,
    tenantId: form.tenantId,
    name: form.name,
    description: form.description || undefined,
    purpose: form.purpose,
    type: form.type || undefined,
    active: form.active,
    createdAt: form.createdAt.toISOString(),
    updatedAt: form.updatedAt.toISOString(),
    fieldsCount: form.fields.length,
    usagesCount: form._count.presences,
    fields: form.fields.map((field: any) => ({
      id: field.id,
      formTemplateId: field.formTemplateId,
      label: field.label,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      options: field.options ? (field.options as string[]) : undefined,
      order: field.order,
    })),
    intervals: form.intervals.map((interval: any) => ({
      id: interval.id,
      formTemplateId: interval.formTemplateId,
      startTime: interval.startTime,
      endTime: interval.endTime,
      createdAt: interval.createdAt.toISOString(),
    })),
  }));
};

/**
 * Récupérer un formulaire par ID
 */
export const getFormTemplateByIdService = async (
  formId: string,
  tenantId: string
): Promise<FormTemplateResponse | null> => {
  const form = await prisma.formTemplate.findFirst({
    where: {
      id: formId,
      tenantId,
    },
    include: {
      fields: {
        orderBy: { order: 'asc' },
      },
      intervals: true,
      _count: {
        select: {
          presences: true,
        },
      },
    },
  });

  if (!form) return null;

  return {
    id: (form as any).id,
    tenantId: (form as any).tenantId,
    name: (form as any).name,
    description: (form as any).description || undefined,
    purpose: (form as any).purpose,
    type: (form as any).type || undefined,
    active: (form as any).active,
    createdAt: (form as any).createdAt.toISOString(),
    updatedAt: (form as any).updatedAt.toISOString(),
    fieldsCount: (form as any).fields.length,
    usagesCount: (form as any)._count.presences,
    fields: (form as any).fields.map((field: any) => ({
      id: field.id,
      formTemplateId: field.formTemplateId,
      label: field.label,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      options: field.options ? (field.options as string[]) : undefined,
      order: field.order,
    })),
    intervals: (form as any).intervals.map((interval: any) => ({
      id: interval.id,
      formTemplateId: interval.formTemplateId,
      startTime: interval.startTime,
      endTime: interval.endTime,
      createdAt: interval.createdAt.toISOString(),
    })),
  };
};

/**
 * Créer un nouveau formulaire
 */
export const createFormTemplateService = async (
  data: CreateFormTemplateRequest,
  tenantId: string
): Promise<FormTemplateResponse> => {
  // Vérifier l'unicité : un seul formulaire actif par purpose par tenant
  const existingActive = await prisma.formTemplate.findFirst({
    where: {
      tenantId,
      purpose: data.purpose,
      active: true,
    },
  });

  if (existingActive) {
    throw new BadRequestError(
      `Un formulaire ${data.purpose.toLowerCase()} actif existe déjà pour cette organisation`
    );
  }

  const form = await prisma.formTemplate.create({
    data: {
      tenantId,
      name: data.name,
      description: data.description,
      purpose: data.purpose,
      type: (data.purpose === 'PRESENCE' ? (data.type as FormType) : null) as any, // Type seulement pour PRESENCE
      active: true,
      fields: {
        create: data.fields.map((field, index) => ({
          label: field.label,
          fieldType: field.fieldType,
          isRequired: field.isRequired || false,
          options: field.options || undefined,
          order: field.order || index,
        })),
      },
      intervals: data.intervals && data.purpose === 'PRESENCE' && data.type === FormType.ARRIVAL_DEPARTURE ? {
        create: data.intervals,
      } : undefined,
    },
    include: {
      fields: {
        orderBy: { order: 'asc' },
      },
      intervals: true,
      _count: {
        select: {
          presences: true,
        },
      },
    },
  });

  return {
    id: (form as any).id,
    tenantId: (form as any).tenantId,
    name: (form as any).name,
    description: (form as any).description || undefined,
    purpose: (form as any).purpose,
    type: (form as any).type || undefined,
    active: (form as any).active,
    createdAt: (form as any).createdAt.toISOString(),
    updatedAt: (form as any).updatedAt.toISOString(),
    fieldsCount: (form as any).fields.length,
    usagesCount: (form as any)._count.presences,
    fields: (form as any).fields.map((field: any) => ({
      id: field.id,
      formTemplateId: field.formTemplateId,
      label: field.label,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      options: field.options ? (field.options as string[]) : undefined,
      order: field.order,
    })),
    intervals: (form as any).intervals.map((interval: any) => ({
      id: interval.id,
      formTemplateId: interval.formTemplateId,
      startTime: interval.startTime,
      endTime: interval.endTime,
      createdAt: interval.createdAt.toISOString(),
    })),
  };
};

/**
 * Récupérer les formulaires actifs d'une organisation (pour les visiteurs)
 */
export const getPublicFormTemplatesService = async (tenantId: string) => {
  const formTemplates = await prisma.formTemplate.findMany({
    where: {
      tenantId,
      active: true, // Seulement les formulaires actifs
    },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      purpose: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return formTemplates;
};

/**
 * Mettre à jour un formulaire
 */
export const updateFormTemplateService = async (
  formId: string,
  tenantId: string,
  data: UpdateFormTemplateRequest
): Promise<FormTemplateResponse> => {
  const form = await prisma.formTemplate.findFirst({
    where: {
      id: formId,
      tenantId,
    },
  });

  if (!form) {
    throw new Error('Formulaire introuvable');
  }

  const updatedForm = await prisma.formTemplate.update({
    where: { id: formId },
    data,
    include: {
      fields: {
        orderBy: { order: 'asc' },
      },
      intervals: true,
      _count: {
        select: {
          presences: true,
        },
      },
    },
  });

  return {
    id: updatedForm.id,
    tenantId: updatedForm.tenantId,
    name: updatedForm.name,
    description: updatedForm.description || undefined,
    purpose: (updatedForm as any).purpose,
    type: (updatedForm as any).type || undefined,
    active: updatedForm.active,
    createdAt: updatedForm.createdAt.toISOString(),
    updatedAt: updatedForm.updatedAt.toISOString(),
    fieldsCount: updatedForm.fields.length,
    usagesCount: updatedForm._count.presences,
    fields: updatedForm.fields.map(field => ({
      id: field.id,
      formTemplateId: field.formTemplateId,
      label: field.label,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      options: field.options ? (field.options as string[]) : undefined,
      order: field.order,
    })),
    intervals: updatedForm.intervals.map(interval => ({
      id: interval.id,
      formTemplateId: interval.formTemplateId,
      startTime: interval.startTime,
      endTime: interval.endTime,
      createdAt: interval.createdAt.toISOString(),
    })),
  };
};

/**
 * Supprimer un formulaire
 */
export const deleteFormTemplateService = async (formId: string, tenantId: string): Promise<void> => {
  const form = await prisma.formTemplate.findFirst({
    where: {
      id: formId,
      tenantId,
    },
  });

  if (!form) {
    throw new Error('Formulaire introuvable');
  }

  // Prisma gère automatiquement la suppression en cascade
  await prisma.formTemplate.delete({
    where: { id: formId },
  });
};

/**
 * Activer/Désactiver un formulaire
 */
export const toggleFormTemplateStatusService = async (
  formId: string,
  tenantId: string
): Promise<FormTemplateResponse> => {
  const form = await prisma.formTemplate.findFirst({
    where: {
      id: formId,
      tenantId,
    },
  });

  if (!form) {
    throw new Error('Formulaire introuvable');
  }

  const newStatus = !form.active;

  const updatedForm = await prisma.formTemplate.update({
    where: { id: formId },
    data: { active: newStatus },
    include: {
      fields: {
        orderBy: { order: 'asc' },
      },
      intervals: true,
      _count: {
        select: {
          presences: true,
        },
      },
    },
  });

  return {
    id: (updatedForm as any).id,
    tenantId: (updatedForm as any).tenantId,
    name: (updatedForm as any).name,
    description: (updatedForm as any).description || undefined,
    purpose: (updatedForm as any).purpose,
    type: (updatedForm as any).type || undefined,
    active: (updatedForm as any).active,
    createdAt: (updatedForm as any).createdAt.toISOString(),
    updatedAt: (updatedForm as any).updatedAt.toISOString(),
    fieldsCount: (updatedForm as any).fields.length,
    usagesCount: (updatedForm as any)._count.presences,
    fields: (updatedForm as any).fields.map((field: any) => ({
      id: field.id,
      formTemplateId: field.formTemplateId,
      label: field.label,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      options: field.options ? (field.options as string[]) : undefined,
      order: field.order,
    })),
    intervals: (updatedForm as any).intervals.map((interval: any) => ({
      id: interval.id,
      formTemplateId: interval.formTemplateId,
      startTime: interval.startTime,
      endTime: interval.endTime,
      createdAt: interval.createdAt.toISOString(),
    })),
  };
};