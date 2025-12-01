import { Router } from 'express';
import { createOrganizationController } from './setup.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, requireSystemAdmin } from '../../middlewares/auth.middleware';
import { createOrganizationSchema } from '../../validators/setup.validator';

const router = Router();

/**
 * POST /api/setup/organization
 * Créer une nouvelle organisation (tenant + super admin)
 * Protégé - SYSTEM_ADMIN uniquement
 */
router.post(
  '/organization',
  authenticate,
  requireSystemAdmin,
  validate(createOrganizationSchema),
  createOrganizationController
);

export default router;