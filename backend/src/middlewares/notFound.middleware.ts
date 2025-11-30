import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../shared/errors';

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
  next(error);
};