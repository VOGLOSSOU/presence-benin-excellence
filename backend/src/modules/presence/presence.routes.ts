import { Router } from 'express';
import { recordPresenceController, getUserPresencesController } from './presence.controller';
import { validate } from '../../middlewares/validate.middleware';
import { recordPresenceSchema } from '../../validators/presence.validator';

const router = Router();

/**
 * POST /api/presence
 * Enregistrer une présence (ARRIVAL, DEPARTURE ou SIMPLE)
 * Public (pas d'authentification requise)
 */
router.post('/', validate(recordPresenceSchema), recordPresenceController);

/**
 * GET /api/presence/:uuidCode
 * Obtenir l'historique des présences d'un utilisateur
 * Public (pas d'authentification requise)
 */
router.get('/:uuidCode', getUserPresencesController);

export default router;