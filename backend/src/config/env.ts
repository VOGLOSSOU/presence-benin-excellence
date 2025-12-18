import { z } from 'zod';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Schema de validation avec Zod
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // Server
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // JWT
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('30d'),
  
  // CORS
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
});

// Valider les variables d'environnement
const validateEnv = () => {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

// Exporter les variables validées
export const env = validateEnv();

export default env;