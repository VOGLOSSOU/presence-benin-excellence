import prisma from '../../config/database';
import { NotFoundError } from '../../shared/errors';
import { CreateFieldTemplateRequest, UpdateFieldTemplateRequest } from './forms.types';
import { getFormTemplateByIdService } from './forms.service';

/**
 * Ajouter un champ à un formulaire
 */
export const addFieldService = async (formId: string, data: CreateFieldTemplateRequest, tenantId: string) => {
  // Vérifier que le formulaire existe et appartient au tenant
  await getFormTemplateByIdService(formId, tenantId);

  const field = await prisma.fieldTemplate.create({
    data: {
      formTemplateId: formId,
      label: data.label,
      fieldType: data.fieldType,
      isRequired: data.isRequired ?? false,
      options: data.options ? data.options : undefined,
      order: data.order ?? 0,
    },
  });

  return field;
};

/**
 * Obtenir tous les champs d'un formulaire
 */
export const getFieldsByFormIdService = async (formId: string, tenantId: string) => {
  // Vérifier que le formulaire existe et appartient au tenant
  await getFormTemplateByIdService(formId, tenantId);

  const fields = await prisma.fieldTemplate.findMany({
    where: { formTemplateId: formId },
    orderBy: { order: 'asc' },
  });

  return fields;
};

/**
 * Mettre à jour un champ
 */
export const updateFieldService = async (fieldId: string, data: UpdateFieldTemplateRequest, tenantId: string) => {
  // Vérifier que le champ existe
  const existingField = await prisma.fieldTemplate.findUnique({
    where: { id: fieldId },
    include: {
      formTemplate: true,
    },
  });

  if (!existingField) {
    throw new NotFoundError('Field template not found');
  }

  // Vérifier que le formulaire appartient au tenant
  if (existingField.formTemplate.tenantId !== tenantId) {
    throw new NotFoundError('Field template not found');
  }

  const updatedField = await prisma.fieldTemplate.update({
    where: { id: fieldId },
    data: {
      label: data.label,
      fieldType: data.fieldType,
      isRequired: data.isRequired,
      options: data.options ? data.options : undefined,
      order: data.order,
    },
  });

  return updatedField;
};

/**
 * Supprimer un champ
 */
export const deleteFieldService = async (fieldId: string, tenantId: string) => {
  // Vérifier que le champ existe
  const existingField = await prisma.fieldTemplate.findUnique({
    where: { id: fieldId },
    include: {
      formTemplate: true,
    },
  });

  if (!existingField) {
    throw new NotFoundError('Field template not found');
  }

  // Vérifier que le formulaire appartient au tenant
  if (existingField.formTemplate.tenantId !== tenantId) {
    throw new NotFoundError('Field template not found');
  }

  await prisma.fieldTemplate.delete({
    where: { id: fieldId },
  });

  return { message: 'Field template deleted successfully' };
};