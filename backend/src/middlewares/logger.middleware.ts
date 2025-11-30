import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour logger toutes les requêtes HTTP
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Logger la requête entrante
  console.log(`➡️  ${req.method} ${req.path}`);

  // Intercepter la fin de la réponse pour logger le temps
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
    
    console.log(
      `${statusColor} ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};