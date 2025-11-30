import { Router } from 'express';
import { loginController, registerController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, requireSuperAdmin } from '../../middlewares/auth.middleware';
import { loginSchema, registerSchema } from '../../validators/auth.validator';

const router = Router();

/**
 * POST /api/auth/login
 * Connexion d'un admin
 * Public
 */
router.post('/login', validate(loginSchema), loginController);

/**
 * POST /api/auth/register
 * Créer un nouvel admin
 * Protégé - SUPER_ADMIN uniquement
 */
router.post(
  '/register',
  authenticate,
  requireSuperAdmin,
  validate(registerSchema),
  registerController
);

export default router;