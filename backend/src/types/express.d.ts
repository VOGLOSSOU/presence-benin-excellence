import { AdminRole } from '@prisma/client';

// Extension des types Express pour ajouter des propriétés personnalisées
declare global {
  namespace Express {
    interface Request {
      // Admin connecté (ajouté par le middleware auth)
      user?: {
        id: string;
        username: string;
        role: AdminRole;
      };
    }
  }
}

export {};