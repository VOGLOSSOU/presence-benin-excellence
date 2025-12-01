import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../shared/errors';

export interface JWTPayload {
  id: string;
  username: string;
  role: string;
  tenantId?: string;  // ← OPTIONNEL pour SYSTEM_ADMIN
}

/**
 * Génère un token JWT
 */
export const generateToken = (payload: JWTPayload): string => {
  // @ts-ignore - Type mismatch with jsonwebtoken library
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Vérifie et décode un token JWT
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    // @ts-ignore - Type mismatch with jsonwebtoken library
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

/**
 * Décode un token sans vérification (pour debug)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};