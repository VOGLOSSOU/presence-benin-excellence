import { Request, Response, NextFunction } from 'express';
import { getAdminStatsService, getAdminActivityService } from './admin.service';
import { successResponse } from '../../utils/response.util';

/**
 * Récupérer les statistiques de l'organisation
 * GET /api/admin/stats
 */
export const getAdminStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = (req as any).user.tenantId;
    const stats = await getAdminStatsService(tenantId);
    successResponse(res, stats, 'Statistiques récupérées avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer l'activité récente de l'organisation
 * GET /api/admin/activity
 */
export const getAdminActivityController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = (req as any).user.tenantId;
    const activity = await getAdminActivityService(tenantId);
    successResponse(res, activity, 'Activité récupérée avec succès');
  } catch (error) {
    next(error);
  }
};