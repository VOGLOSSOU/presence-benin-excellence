import app from './app';
import { env } from './config/env';
import './config/database'; // Connexion DB

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 BENIN EXCELLENCE - Présence API                 ║
║                                                       ║
║   Server: http://localhost:${PORT}                  ║
║   Environment: ${env.NODE_ENV.padEnd(11)}                    ║
║   Database: Connected ✅                             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Gestion propre de l'arrêt du serveur
const gracefulShutdown = async () => {
  console.log('\n🔄 Shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // Forcer l'arrêt après 10 secondes
  setTimeout(() => {
    console.error('⚠️  Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);