import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { validationErrorResponse } from '../utils/response.util';

/**
 * Middleware de validation avec Zod
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Valider body, query, et params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('❌ [Validation Middleware] Erreurs de validation Zod:');
        error.errors.forEach((err, index) => {
          console.log(`  ${index + 1}. Champ: ${err.path.join('.')}`);
          console.log(`     Message: ${err.message}`);
          console.log(`     Code: ${err.code}`);
        });

        console.log('📦 [Validation Middleware] Données reçues:', JSON.stringify({
          body: req.body,
          query: req.query,
          params: req.params,
        }, null, 2));

        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        validationErrorResponse(res, errors);
        return;
      }
      
      next(error);
    }
  };
};