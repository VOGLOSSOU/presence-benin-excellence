import { Request, Response, NextFunction } from 'express';
import { enrollUserService } from './enrollment.service';
import { successResponse } from '../../utils/response.util';
import { HTTP_STATUS } from '../../config/constants';

/**
 * Enrôler un nouveau visiteur
 * POST /api/enrollment
 */
export const enrollUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await enrollUserService(req.body);
    successResponse(res, result, result.message, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};