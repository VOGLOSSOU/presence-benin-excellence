import prisma from '../../config/database';
import { NotFoundError } from '../../shared/errors';
import { CreateFieldRequest, UpdateFieldRequest } from './forms.types';
import { getFormByIdService } from './forms.service';

/**
 * Ajouter un champ à un formulaire
 */
export const addFieldService = async (formId: string, data: CreateFieldRequest) => {
  // Vérifier que le formulaire existe
  await getFormByIdService(formId);

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
export const getFieldsByFormIdService = async (formId: string) => {
  // Vérifier que le formulaire existe
  await getFormByIdService(formId);

  const fields = await prisma.fieldTemplate.findMany({
    where: { formTemplateId: formId },
    orderBy: { order: 'asc' },
  });

  return fields;
};

/**
 * Mettre à jour un champ
 */
export const updateFieldService = async (fieldId: string, data: UpdateFieldRequest) => {
  // Vérifier que le champ existe
  const existingField = await prisma.fieldTemplate.findUnique({
    where: { id: fieldId },
  });

  if (!existingField) {
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
export const deleteFieldService = async (fieldId: string) => {
  // Vérifier que le champ existe
  const existingField = await prisma.fieldTemplate.findUnique({
    where: { id: fieldId },
  });

  if (!existingField) {
    throw new NotFoundError('Field template not found');
  }

  await prisma.fieldTemplate.delete({
    where: { id: fieldId },
  });

  return { message: 'Field template deleted successfully' };
};