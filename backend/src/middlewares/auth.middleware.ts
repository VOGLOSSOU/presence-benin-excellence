import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { UnauthorizedError } from '../shared/errors';
import { AdminRole } from '@prisma/client';

/**
 * Middleware pour vérifier le JWT
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }
    
    const token = authHeader.substring(7); // Enlever "Bearer "
    
    // Vérifier et décoder le token
    const decoded = verifyToken(token);
    
    // Ajouter les infos de l'utilisateur à la requête
    (req as any).user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role as AdminRole,
      tenantId: decoded.tenantId,  // ← NOUVEAU
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware pour vérifier le rôle admin
 */
export const requireRole = (...allowedRoles: AdminRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        throw new UnauthorizedError('Authentication required');
      }
      
      if (!allowedRoles.includes(user.role)) {
        throw new UnauthorizedError('Insufficient permissions');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware pour vérifier que l'utilisateur est un super admin
 */
export const requireSuperAdmin = requireRole(AdminRole.SUPER_ADMIN);