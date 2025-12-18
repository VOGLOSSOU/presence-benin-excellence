import prisma from '../../config/database';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from './users.types';
import { UserStatus } from '@prisma/client';

/**
 * Génère un code UUID unique pour l'utilisateur
 */
const generateUniqueUserCode = async (tenantCode: string): Promise<string> => {
  const baseCode = `${tenantCode}-`;

  // Génère un code aléatoire de 7 caractères alphanumériques
  const generateRandomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let finalCode: string;
  let attempts = 0;

  do {
    finalCode = baseCode + generateRandomCode();
    attempts++;

    if (attempts > 100) {
      throw new Error('Impossible de générer un code unique pour cet utilisateur');
    }
  } while (await prisma.user.findUnique({ where: { uuidCode: finalCode } }));

  return finalCode;
};

/**
 * Récupérer tous les utilisateurs d'une organisation
 */
export const getAllUsersService = async (tenantId: string): Promise<UserResponse[]> => {
  const users = await prisma.user.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: {
          presences: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users.map(user => ({
    id: user.id,
    tenantId: user.tenantId,
    uuidCode: user.uuidCode,
    lastName: user.lastName,
    firstName: user.firstName,
    title: user.title,
    phone: user.phone || undefined,
    email: user.email || undefined,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    presencesCount: user._count.presences,
  }));
};

/**
 * Récupérer un utilisateur par ID
 */
export const getUserByIdService = async (userId: string, tenantId: string): Promise<UserResponse | null> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
    },
    include: {
      _count: {
        select: {
          presences: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    tenantId: user.tenantId,
    uuidCode: user.uuidCode,
    lastName: user.lastName,
    firstName: user.firstName,
    title: user.title,
    phone: user.phone || undefined,
    email: user.email || undefined,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    presencesCount: user._count.presences,
  };
};

/**
 * Créer un nouvel utilisateur
 */
export const createUserService = async (
  data: CreateUserRequest,
  tenantId: string
): Promise<UserResponse> => {
  // Récupérer le code du tenant pour générer le UUID
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { code: true },
  });

  if (!tenant) {
    throw new Error('Organisation introuvable');
  }

  // Générer un code UUID unique
  const uuidCode = await generateUniqueUserCode(tenant.code);

  const user = await prisma.user.create({
    data: {
      tenantId,
      uuidCode,
      lastName: data.lastName,
      firstName: data.firstName,
      title: data.title,
      phone: data.phone,
      email: data.email,
      status: UserStatus.ACTIF,
    },
    include: {
      _count: {
        select: {
          presences: true,
        },
      },
    },
  });

  return {
    id: user.id,
    tenantId: user.tenantId,
    uuidCode: user.uuidCode,
    lastName: user.lastName,
    firstName: user.firstName,
    title: user.title,
    phone: user.phone || undefined,
    email: user.email || undefined,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    presencesCount: user._count.presences,
  };
};

/**
 * Mettre à jour un utilisateur
 */
export const updateUserService = async (
  userId: string,
  tenantId: string,
  data: UpdateUserRequest
): Promise<UserResponse> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
    },
  });

  if (!user) {
    throw new Error('Utilisateur introuvable');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    include: {
      _count: {
        select: {
          presences: true,
        },
      },
    },
  });

  return {
    id: updatedUser.id,
    tenantId: updatedUser.tenantId,
    uuidCode: updatedUser.uuidCode,
    lastName: updatedUser.lastName,
    firstName: updatedUser.firstName,
    title: updatedUser.title,
    phone: updatedUser.phone || undefined,
    email: updatedUser.email || undefined,
    status: updatedUser.status,
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
    presencesCount: updatedUser._count.presences,
  };
};

/**
 * Supprimer un utilisateur
 */
export const deleteUserService = async (userId: string, tenantId: string): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
    },
  });

  if (!user) {
    throw new Error('Utilisateur introuvable');
  }

  // Prisma gère automatiquement la suppression en cascade
  await prisma.user.delete({
    where: { id: userId },
  });
};

/**
 * Activer/Désactiver un utilisateur
 */
export const toggleUserStatusService = async (
  userId: string,
  tenantId: string
): Promise<UserResponse> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
    },
  });

  if (!user) {
    throw new Error('Utilisateur introuvable');
  }

  const newStatus = user.status === UserStatus.ACTIF ? UserStatus.INACTIF : UserStatus.ACTIF;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
    include: {
      _count: {
        select: {
          presences: true,
        },
      },
    },
  });

  return {
    id: updatedUser.id,
    tenantId: updatedUser.tenantId,
    uuidCode: updatedUser.uuidCode,
    lastName: updatedUser.lastName,
    firstName: updatedUser.firstName,
    title: updatedUser.title,
    phone: updatedUser.phone || undefined,
    email: updatedUser.email || undefined,
    status: updatedUser.status,
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
    presencesCount: updatedUser._count.presences,
  };
};