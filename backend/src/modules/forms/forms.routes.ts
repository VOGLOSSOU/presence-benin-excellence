import { Router } from 'express';
import {
  createFormController,
  getAllFormsController,
  getFormByIdController,
  updateFormController,
  deleteFormController,
  createIntervalController,
} from './forms.controller';
import {
  addFieldController,
  getFieldsByFormIdController,
  updateFieldController,
  deleteFieldController,
} from './fields.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';
import {
  createFormSchema,
  updateFormSchema,
  createFieldSchema,
  updateFieldSchema,
  createIntervalSchema,
} from '../../validators/form.validator';
import { AdminRole } from '@prisma/client';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// ===== ROUTES FORMULAIRES =====

/**
 * GET /api/forms
 * Obtenir tous les formulaires
 */
router.get('/', getAllFormsController);

/**
 * GET /api/forms/:id
 * Obtenir un formulaire par ID
 */
router.get('/:id', getFormByIdController);

/**
 * POST /api/forms
 * Créer un nouveau formulaire (SUPER_ADMIN uniquement)
 */
router.post(
  '/',
  requireRole(AdminRole.SUPER_ADMIN),
  validate(createFormSchema),
  createFormController
);

/**
 * PUT /api/forms/:id
 * Mettre à jour un formulaire (SUPER_ADMIN uniquement)
 */
router.put(
  '/:id',
  requireRole(AdminRole.SUPER_ADMIN),
  validate(updateFormSchema),
  updateFormController
);

/**
 * DELETE /api/forms/:id
 * Supprimer un formulaire (SUPER_ADMIN uniquement)
 */
router.delete('/:id', requireRole(AdminRole.SUPER_ADMIN), deleteFormController);

// ===== ROUTES INTERVALLES =====

/**
 * POST /api/forms/:id/interval
 * Créer un intervalle pour un formulaire ARRIVAL_DEPARTURE
 */
router.post(
  '/:id/interval',
  requireRole(AdminRole.SUPER_ADMIN),
  validate(createIntervalSchema),
  createIntervalController
);

// ===== ROUTES CHAMPS =====

/**
 * GET /api/forms/:id/fields
 * Obtenir tous les champs d'un formulaire
 */
router.get('/:id/fields', getFieldsByFormIdController);

/**
 * POST /api/forms/:id/fields
 * Ajouter un champ à un formulaire
 */
router.post(
  '/:id/fields',
  requireRole(AdminRole.SUPER_ADMIN),
  validate(createFieldSchema),
  addFieldController
);

/**
 * PUT /api/forms/fields/:fieldId
 * Mettre à jour un champ
 */
router.put(
  '/fields/:fieldId',
  requireRole(AdminRole.SUPER_ADMIN),
  validate(updateFieldSchema),
  updateFieldController
);

/**
 * DELETE /api/forms/fields/:fieldId
 * Supprimer un champ
 */
router.delete(
  '/fields/:fieldId',
  requireRole(AdminRole.SUPER_ADMIN),
  deleteFieldController
);

export default router;