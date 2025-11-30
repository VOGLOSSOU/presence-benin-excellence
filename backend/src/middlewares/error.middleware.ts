import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { HTTP_STATUS } from '../config/constants';
import { env } from '../config/env';

/**
 * Middleware de gestion globale des erreurs
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log de l'erreur en développement
  if (env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Si c'est une erreur opérationnelle (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: env.NODE_ENV === 'development' ? {
        name: err.name,
        stack: err.stack,
      } : undefined,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Gestion des erreurs Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    if (prismaError.code === 'P2002') {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A record with this value already exists',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    if (prismaError.code === 'P2025') {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Record not found',
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }

  // Erreur générique (non gérée)
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    error: env.NODE_ENV === 'development' ? {
      name: err.name,
      message: err.message,
      stack: err.stack,
    } : undefined,
    timestamp: new Date().toISOString(),
  });
};