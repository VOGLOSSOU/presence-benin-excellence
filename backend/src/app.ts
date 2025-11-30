import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { requestLogger } from './middlewares/logger.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// ===== MIDDLEWARES DE SÉCURITÉ =====
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// ===== RATE LIMITING =====
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later',
});
app.use('/api/', limiter);

// ===== PARSING =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== LOGGER =====
if (env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// ===== ROUTE DE SANTÉ =====
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'BENIN EXCELLENCE - Système de Présence API',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ===== ROUTES API =====
// TODO: Importer et utiliser les routes des modules
import authRoutes from './modules/auth/auth.routes';
import formsRoutes from './modules/forms/forms.routes';
import enrollmentRoutes from './modules/enrollment/enrollment.routes';
// import enrollmentRoutes from './modules/enrollment/enrollment.routes';
// import presenceRoutes from './modules/presence/presence.routes';
// import formsRoutes from './modules/forms/forms.routes';
// import usersRoutes from './modules/users/users.routes';
// import adminRoutes from './modules/admin/admin.routes';


app.use('/api/auth', authRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/enrollment', enrollmentRoutes);

// app.use('/api/enrollment', enrollmentRoutes);
// app.use('/api/presence', presenceRoutes);
// app.use('/api/forms', formsRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/admin', adminRoutes);

// ===== GESTION DES ERREURS =====
app.use(notFoundHandler);   // Route 404
app.use(errorHandler);      // Erreurs globales

export default app;