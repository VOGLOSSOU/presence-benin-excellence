import prisma from '../config/database';
import { UUID_PREFIX, UUID_LENGTH } from '../config/constants';

/**
 * Génère un UUID personnalisé au format BE-XXXXXX
 * Ex: BE-8F92GHT
 */
export const generateCustomUUID = async (): Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let uuid: string;
  let isUnique = false;

  // Boucle jusqu'à trouver un UUID unique
  while (!isUnique) {
    let code = '';
    
    // Générer le code aléatoire
    for (let i = 0; i < UUID_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }
    
    uuid = `${UUID_PREFIX}${code}`;
    
    // Vérifier l'unicité dans la base de données
    const existingUser = await prisma.user.findUnique({
      where: { uuidCode: uuid },
    });
    
    if (!existingUser) {
      isUnique = true;
    }
  }

  return uuid!;
};

/**
 * Vérifie si un UUID est au bon format
 */
export const isValidCustomUUID = (uuid: string): boolean => {
  const pattern = new RegExp(`^${UUID_PREFIX}[A-Z0-9]{${UUID_LENGTH}}$`);
  return pattern.test(uuid);
};

/**
 * Vérifie si un UUID existe dans la base de données
 */
export const uuidExists = async (uuid: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { uuidCode: uuid },
  });
  return !!user;
};