import { Router } from 'express';
import { getAdminStatsController, getAdminActivityController } from './admin.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

/**
 * GET /api/admin/stats
 * Récupérer les statistiques de l'organisation
 */
router.get('/stats', getAdminStatsController);

/**
 * GET /api/admin/activity
 * Récupérer l'activité récente de l'organisation
 */
router.get('/activity', getAdminActivityController);

export default router;