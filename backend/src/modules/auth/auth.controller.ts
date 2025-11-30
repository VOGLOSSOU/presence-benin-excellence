import { Request, Response, NextFunction } from 'express';
import { loginService, registerService } from './auth.service';
import { successResponse } from '../../utils/response.util';
import { MESSAGES, HTTP_STATUS } from '../../config/constants';

/**
 * Controller de connexion
 * POST /api/auth/login
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await loginService(req.body);
    successResponse(res, result, MESSAGES.LOGIN_SUCCESS, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller d'enregistrement d'un admin
 * POST /api/auth/register
 */
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await registerService(req.body);
    successResponse(res, result, 'Admin created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};