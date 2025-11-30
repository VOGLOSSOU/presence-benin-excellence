import { PrismaClient } from '@prisma/client';

// Instance unique de Prisma Client (Singleton)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Connexion à la base de données
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Déconnexion propre lors de l'arrêt
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('📦 Database disconnected');
});

export default prisma;