import { Request, Response, NextFunction } from 'express';
import { createOrganizationService } from './setup.service';
import { successResponse } from '../../utils/response.util';
import { HTTP_STATUS } from '../../config/constants';

/**
 * Controller de création d'une organisation
 * POST /api/setup/organization
 */
export const createOrganizationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await createOrganizationService(req.body);
    successResponse(res, result, 'Organization created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};