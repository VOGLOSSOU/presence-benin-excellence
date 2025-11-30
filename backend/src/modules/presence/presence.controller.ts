import { Request, Response, NextFunction } from 'express';
import { recordPresenceService, getUserPresencesService } from './presence.service';
import { successResponse } from '../../utils/response.util';
import { HTTP_STATUS } from '../../config/constants';

/**
 * Enregistrer une présence
 * POST /api/presence
 */
export const recordPresenceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await recordPresenceService(req.body);
    successResponse(res, result, result.message, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir l'historique des présences d'un utilisateur
 * GET /api/presence/:uuidCode
 */
export const getUserPresencesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await getUserPresencesService(req.params.uuidCode);
    successResponse(res, result, 'Presences retrieved successfully');
  } catch (error) {
    next(error);
  }
};