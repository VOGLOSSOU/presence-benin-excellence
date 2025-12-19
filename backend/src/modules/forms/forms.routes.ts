import { Router } from 'express';
import {
  getAllFormTemplatesController,
  getFormTemplateByIdController,
  createFormTemplateController,
  updateFormTemplateController,
  deleteFormTemplateController,
  toggleFormTemplateStatusController,
  getPublicFormTemplatesController,
  getPublicFormTemplateByIdController,
} from './forms.controller';
import { authenticate, requireSuperAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// Route publique pour récupérer les formulaires actifs d'une organisation (pour les visiteurs)
/**
 * GET /api/forms/public/{tenantId}
 * Récupérer les formulaires actifs d'une organisation (public)
 */
router.get('/public/:tenantId', getPublicFormTemplatesController);

/**
 * GET /api/forms/public/{tenantId}/{formId}
 * Récupérer un formulaire spécifique d'une organisation (public)
 */
router.get('/public/:tenantId/:formId', getPublicFormTemplateByIdController);

// Toutes les autres routes formulaires nécessitent une authentification
router.use(authenticate);

// Toutes les routes formulaires nécessitent le rôle SUPER_ADMIN
router.use(requireSuperAdmin);

/**
 * GET /api/admin/forms
 * Récupérer tous les formulaires de l'organisation
 */
router.get('/', getAllFormTemplatesController);

/**
 * POST /api/admin/forms
 * Créer un nouveau formulaire
 */
router.post('/', createFormTemplateController);

/**
 * GET /api/admin/forms/{formId}
 * Récupérer un formulaire par ID
 */
router.get('/:formId', getFormTemplateByIdController);

/**
 * PUT /api/admin/forms/{formId}
 * Mettre à jour un formulaire
 */
router.put('/:formId', updateFormTemplateController);

/**
 * PUT /api/admin/forms/{formId}/toggle-status
 * Activer/Désactiver un formulaire
 */
router.put('/:formId/toggle-status', toggleFormTemplateStatusController);

/**
 * DELETE /api/admin/forms/{formId}
 * Supprimer un formulaire
 */
router.delete('/:formId', deleteFormTemplateController);

export default router;