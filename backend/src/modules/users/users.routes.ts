import { Router } from 'express';
import {
  getAllUsersController,
  getUserByIdController,
  getUserByUUIDController,
  createUserController,
  updateUserController,
  deleteUserController,
  toggleUserStatusController,
} from './users.controller';
import { authenticate, requireSuperAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// Route publique pour récupérer un utilisateur par UUID (pour les visiteurs)
router.get('/by-uuid/:uuid', getUserByUUIDController);

// Toutes les autres routes utilisateurs nécessitent une authentification
router.use(authenticate);

// Toutes les autres routes utilisateurs nécessitent le rôle SUPER_ADMIN
router.use(requireSuperAdmin);

/**
 * GET /api/admin/users
 * Récupérer tous les utilisateurs de l'organisation
 */
router.get('/', getAllUsersController);

/**
 * POST /api/admin/users
 * Créer un nouvel utilisateur
 */
router.post('/', createUserController);

/**
 * GET /api/admin/users/{userId}
 * Récupérer un utilisateur par ID
 */
router.get('/:userId', getUserByIdController);

/**
 * PUT /api/admin/users/{userId}
 * Mettre à jour un utilisateur
 */
router.put('/:userId', updateUserController);

/**
 * PUT /api/admin/users/{userId}/toggle-status
 * Activer/Désactiver un utilisateur
 */
router.put('/:userId/toggle-status', toggleUserStatusController);

/**
 * DELETE /api/admin/users/{userId}
 * Supprimer un utilisateur
 */
router.delete('/:userId', deleteUserController);

export default router;