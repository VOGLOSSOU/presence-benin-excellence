import { Router } from 'express';
import {
  createOrganizationController,
  getAllOrganizationsController,
  getSystemStatsController,
  resetAdminPasswordController,
  deactivateOrganizationController,
  activateOrganizationController,
  deleteOrganizationController,
  getTenantInfoController,
  getTenantByCodeController,
} from './setup.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, requireSystemAdmin, requireSystemAdminOrOwnTenant } from '../../middlewares/auth.middleware';
import { createOrganizationSchema } from '../../validators/setup.validator';

const router = Router();

// Route publique pour récupérer une organisation par son code (pour les visiteurs)
router.get('/tenants/by-code/:code', getTenantByCodeController);

// Toutes les routes setup nécessitent une authentification
router.use(authenticate);

// Route spéciale pour récupérer les infos d'un tenant (accessible aux SUPER_ADMIN de leur propre tenant)
router.get('/tenants/:tenantId', requireSystemAdminOrOwnTenant, getTenantInfoController);

// Routes pour les administrateurs système uniquement
router.use(requireSystemAdmin);

/**
 * POST /api/setup/organization
 * Créer une nouvelle organisation avec son premier admin
 */
router.post('/organization', validate(createOrganizationSchema), createOrganizationController);

/**
 * GET /api/setup/organizations
 * Récupérer toutes les organisations
 */
router.get('/organizations', getAllOrganizationsController);

/**
 * GET /api/setup/stats
 * Récupérer les statistiques globales du système
 */
router.get('/stats', getSystemStatsController);

/**
 * PUT /api/setup/admins/{adminId}/reset-password
 * Reset le mot de passe d'un admin
 */
router.put('/admins/:adminId/reset-password', resetAdminPasswordController);

/**
 * PUT /api/setup/organizations/{tenantId}/deactivate
 * Désactiver une organisation
 */
router.put('/organizations/:tenantId/deactivate', deactivateOrganizationController);

/**
 * PUT /api/setup/organizations/{tenantId}/activate
 * Réactiver une organisation
 */
router.put('/organizations/:tenantId/activate', activateOrganizationController);

/**
 * DELETE /api/setup/organizations/{tenantId}
 * Supprimer une organisation
 */
router.delete('/organizations/:tenantId', deleteOrganizationController);

export default router;