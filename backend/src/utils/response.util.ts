import { Response } from 'express';
import { HTTP_STATUS } from '../config/constants';

/**
 * Interface pour les réponses API standardisées
 */
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
}

/**
 * Réponse de succès
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = HTTP_STATUS.OK
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Réponse d'erreur
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  error?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Réponse de validation error
 */
export const validationErrorResponse = (
  res: Response,
  errors: any
): Response => {
  const response: ApiResponse = {
    success: false,
    message: 'Validation failed',
    error: errors,
    timestamp: new Date().toISOString(),
  };

  return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
};

/**
 * Réponse paginée
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
): Response => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(HTTP_STATUS.OK).json(response);
};