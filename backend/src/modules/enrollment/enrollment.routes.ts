import { Router } from 'express';
import { enrollUserController } from './enrollment.controller';
import { validate } from '../../middlewares/validate.middleware';
import { enrollmentSchema } from '../../validators/user.validator';

const router = Router();

/**
 * POST /api/enrollment
 * Enrôler un nouveau visiteur
 * Public (pas d'authentification requise)
 */
router.post('/', validate(enrollmentSchema), enrollUserController);

export default router;