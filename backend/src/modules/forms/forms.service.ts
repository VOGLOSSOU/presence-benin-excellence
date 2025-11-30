import prisma from '../../config/database';
import { NotFoundError } from '../../shared/errors';
import { CreateFormRequest, UpdateFormRequest, CreateIntervalRequest } from './forms.types';

/**
 * Créer un nouveau formulaire
 */
export const createFormService = async (data: CreateFormRequest) => {
  const form = await prisma.formTemplate.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      active: data.active ?? true,
    },
    include: {
      fields: true,
      intervals: true,
    },
  });

  return form;
};

/**
 * Obtenir tous les formulaires
 */
export const getAllFormsService = async () => {
  const forms = await prisma.formTemplate.findMany({
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
    orderBy: { createdAt: 'desc' },
  });

  return forms;
};

/**
 * Obtenir un formulaire par ID
 */
export const getFormByIdService = async (id: string) => {
  const form = await prisma.formTemplate.findUnique({
    where: { id },
    include: {
      fields: {
        orderBy: { order: 'asc' },
      },
      intervals: true,
    },
  });

  if (!form) {
    throw new NotFoundError('Form template not found');
  }

  return form;
};

/**
 * Mettre à jour un formulaire
 */
export const updateFormService = async (id: string, data: UpdateFormRequest) => {
  // Vérifier que le formulaire existe
  await getFormByIdService(id);

  const updatedForm = await prisma.formTemplate.update({
    where: { id },
    data,
    include: {
      fields: {
        orderBy: { order: 'asc' },
      },
      intervals: true,
    },
  });

  return updatedForm;
};

/**
 * Supprimer un formulaire
 */
export const deleteFormService = async (id: string) => {
  // Vérifier que le formulaire existe
  await getFormByIdService(id);

  await prisma.formTemplate.delete({
    where: { id },
  });

  return { message: 'Form template deleted successfully' };
};

/**
 * Créer un intervalle pour un formulaire arrival/departure
 */
export const createIntervalService = async (formId: string, data: CreateIntervalRequest) => {
  // Vérifier que le formulaire existe
  const form = await getFormByIdService(formId);

  // Vérifier que c'est un formulaire arrival/departure
  if (form.type !== 'ARRIVAL_DEPARTURE') {
    throw new NotFoundError('Intervals can only be added to ARRIVAL_DEPARTURE forms');
  }

  // Supprimer l'ancien intervalle s'il existe (un seul intervalle par formulaire)
  await prisma.arrivalDepartureInterval.deleteMany({
    where: { formTemplateId: formId },
  });

  // Créer le nouvel intervalle
  const interval = await prisma.arrivalDepartureInterval.create({
    data: {
      formTemplateId: formId,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });

  return interval;
};