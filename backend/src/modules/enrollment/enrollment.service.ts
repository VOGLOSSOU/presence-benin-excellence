import prisma from '../../config/database';
import { generateCustomUUID } from '../../utils/uuid-generator';
import { NotFoundError, BadRequestError } from '../../shared/errors';
import { EnrollmentRequest } from './enrollment.types';

/**
 * Enrôler un nouveau visiteur
 */
export const enrollUserService = async (data: EnrollmentRequest) => {
  // 1. Vérifier que le formulaire existe et est actif
  const formTemplate = await prisma.formTemplate.findUnique({
    where: { id: data.formTemplateId },
    include: {
      fields: true,
      tenant: true,  // ← NOUVEAU : Récupérer le tenant du formulaire
    },
  });

  if (!formTemplate) {
    throw new NotFoundError('Form template not found');
  }

  if (!formTemplate.active) {
    throw new BadRequestError('Form template is not active');
  }

  // Le tenantId est déduit du formulaire choisi
  const tenantId = formTemplate.tenantId;

  // 2. Valider que tous les champs requis sont fournis
  const requiredFields = formTemplate.fields.filter((f) => f.isRequired);
  const providedFieldIds = data.fieldValues.map((fv) => fv.fieldTemplateId);

  for (const requiredField of requiredFields) {
    if (!providedFieldIds.includes(requiredField.id)) {
      throw new BadRequestError(`Required field '${requiredField.label}' is missing`);
    }
  }

  // 3. Valider que tous les champs fournis existent dans le formulaire
  const validFieldIds = formTemplate.fields.map((f) => f.id);
  for (const fieldValue of data.fieldValues) {
    if (!validFieldIds.includes(fieldValue.fieldTemplateId)) {
      throw new BadRequestError(`Invalid field ID: ${fieldValue.fieldTemplateId}`);
    }
  }

  // 4. Générer un UUID unique
  const uuidCode = await generateCustomUUID();

  // 5. Créer l'utilisateur avec ses valeurs de champs (transaction)
  const user = await prisma.$transaction(async (tx) => {
    // Créer l'utilisateur avec le tenantId du formulaire
    const newUser = await tx.user.create({
      data: {
        tenantId,  // ← Déduit du formulaire
        uuidCode,
        lastName: data.lastName,
        firstName: data.firstName,
        title: data.title,
        phone: data.phone,
        email: data.email,
      },
    });

    // Créer les valeurs des champs
    if (data.fieldValues.length > 0) {
      await tx.userFieldValue.createMany({
        data: data.fieldValues.map((fv) => ({
          userId: newUser.id,
          fieldTemplateId: fv.fieldTemplateId,
          formTemplateId: data.formTemplateId,
          value: fv.value,
        })),
      });
    }

    return newUser;
  });

  // 6. Récupérer l'utilisateur avec ses valeurs de champs
  const userWithFields = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      fieldValues: {
        include: {
          fieldTemplate: true,
        },
      },
    },
  });

  return {
    user: {
      id: user.id,
      uuidCode: user.uuidCode,
      lastName: user.lastName,
      firstName: user.firstName,
      title: user.title,
      phone: user.phone || undefined,
      email: user.email || undefined,
      fieldValues: userWithFields?.fieldValues.map((fv) => ({
        field: fv.fieldTemplate.label,
        value: fv.value,
      })),
    },
    message: `User enrolled successfully. UUID: ${user.uuidCode}`,
  };
};