import { Request, Response, NextFunction } from 'express';
import {
  createOrganizationService,
  getAllOrganizationsService,
  getSystemStatsService,
  resetAdminPasswordService,
  deactivateOrganizationService,
  activateOrganizationService,
  deleteOrganizationService,
  getTenantInfoService,
  getTenantByCodeService,
} from './setup.service';
import { successResponse } from '../../utils/response.util';
import { HTTP_STATUS } from '../../config/constants';
import { resetAdminPasswordSchema } from '../../validators/setup.validator';
import { validate } from '../../middlewares/validate.middleware';

/**
 * Créer une nouvelle organisation
 * POST /api/setup/organization
 */
export const createOrganizationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Récupérer le rôle de l'utilisateur actuel (SYSTEM_ADMIN ou autre)
    const currentUserRole = (req as any).user?.role;
    const result = await createOrganizationService(req.body, currentUserRole);
    successResponse(res, result, 'Organisation créée avec succès', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer toutes les organisations
 * GET /api/setup/organizations
 */
export const getAllOrganizationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('📡 [getAllOrganizationsController] Requête reçue');
    console.log('👤 [getAllOrganizationsController] User:', (req as any).user);

    const organizations = await getAllOrganizationsService();
    console.log('📤 [getAllOrganizationsController] Envoi réponse:', organizations.length, 'organisations');
    console.log('📋 [getAllOrganizationsController] Données:', JSON.stringify(organizations, null, 2));

    successResponse(res, organizations, 'Organisations récupérées avec succès');
  } catch (error) {
    console.error('❌ [getAllOrganizationsController] Erreur:', error);
    next(error);
  }
};

/**
 * Récupérer les statistiques système
 * GET /api/setup/stats
 */
export const getSystemStatsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await getSystemStatsService();
    successResponse(res, stats, 'Statistiques récupérées avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Reset le mot de passe d'un admin
 * PUT /api/setup/admins/{adminId}/reset-password
 */
export const resetAdminPasswordController = [
  validate(resetAdminPasswordSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { adminId } = req.params;
      const { newPassword } = req.body;

      const result = await resetAdminPasswordService(adminId, newPassword);
      successResponse(res, result, 'Mot de passe réinitialisé avec succès');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Désactiver une organisation
 * PUT /api/setup/organizations/{tenantId}/deactivate
 */
export const deactivateOrganizationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tenantId } = req.params;

    const result = await deactivateOrganizationService(tenantId);
    successResponse(res, result, 'Organisation désactivée avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Réactiver une organisation
 * PUT /api/setup/organizations/{tenantId}/activate
 */
export const activateOrganizationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tenantId } = req.params;

    const result = await activateOrganizationService(tenantId);
    successResponse(res, result, 'Organisation réactivée avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une organisation
 * DELETE /api/setup/organizations/{tenantId}
 */
export const deleteOrganizationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tenantId } = req.params;

    const result = await deleteOrganizationService(tenantId);
    successResponse(res, result, 'Organisation supprimée avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les informations d'un tenant
 * GET /api/setup/tenants/{tenantId}
 */
export const getTenantInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tenantId } = req.params;

    const tenant = await getTenantInfoService(tenantId);
    successResponse(res, tenant, 'Informations du tenant récupérées avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une organisation par son code (public)
 * GET /api/setup/tenants/by-code/{code}
 */
export const getTenantByCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.params;

    const tenant = await getTenantByCodeService(code);
    successResponse(res, tenant, 'Organisation trouvée');
  } catch (error) {
    next(error);
  }
};