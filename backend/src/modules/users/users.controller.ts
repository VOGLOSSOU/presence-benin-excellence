import { Request, Response, NextFunction } from 'express';
import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
  toggleUserStatusService,
} from './users.service';
import { successResponse } from '../../utils/response.util';
import { HTTP_STATUS } from '../../config/constants';

/**
 * Récupérer tous les utilisateurs de l'organisation
 * GET /api/admin/users
 */
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = (req as any).user.tenantId;
    const users = await getAllUsersService(tenantId);
    successResponse(res, users, 'Utilisateurs récupérés avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un utilisateur par ID
 * GET /api/admin/users/{userId}
 */
export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const tenantId = (req as any).user.tenantId;

    const user = await getUserByIdService(userId, tenantId);
    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Utilisateur introuvable',
      });
      return;
    }

    successResponse(res, user, 'Utilisateur récupéré avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouvel utilisateur
 * POST /api/admin/users
 */
export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = (req as any).user.tenantId;
    const user = await createUserService(req.body, tenantId);
    successResponse(res, user, 'Utilisateur créé avec succès', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un utilisateur
 * PUT /api/admin/users/{userId}
 */
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const tenantId = (req as any).user.tenantId;

    const user = await updateUserService(userId, tenantId, req.body);
    successResponse(res, user, 'Utilisateur mis à jour avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un utilisateur
 * DELETE /api/admin/users/{userId}
 */
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const tenantId = (req as any).user.tenantId;

    await deleteUserService(userId, tenantId);
    successResponse(res, null, 'Utilisateur supprimé avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Activer/Désactiver un utilisateur
 * PUT /api/admin/users/{userId}/toggle-status
 */
export const toggleUserStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const tenantId = (req as any).user.tenantId;

    const user = await toggleUserStatusService(userId, tenantId);
    successResponse(res, user, 'Statut de l\'utilisateur mis à jour avec succès');
  } catch (error) {
    next(error);
  }
};