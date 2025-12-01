import prisma from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { generateToken } from '../../utils/jwt.util';
import { UnauthorizedError, BadRequestError } from '../../shared/errors';
import { LoginRequest, RegisterRequest, AuthResponse } from './auth.types';

/**
 * Service de connexion
 */
export const loginService = async (data: LoginRequest): Promise<AuthResponse> => {
  const { username, password } = data;

  // Vérifier si l'admin existe
  const admin = await prisma.adminUser.findUnique({
    where: { username },
    include: {
      tenant: true,
    },
  });

  if (!admin) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await comparePassword(password, admin.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Générer le token JWT avec tenantId
  const token = generateToken({
    id: admin.id,
    username: admin.username,
    role: admin.role,
    tenantId: admin.tenantId,
  });

  return {
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    },
    token,
  };
};

/**
 * Service d'enregistrement d'un nouvel admin
 * NOTE : requiredTenantId est fourni par le controller depuis req.user.tenantId
 */
export const registerService = async (
  data: RegisterRequest,
  requiredTenantId: string
): Promise<AuthResponse> => {
  const { username, password, role } = data;

  // Vérifier si l'username existe déjà
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    throw new BadRequestError('Username already exists');
  }

  // Hasher le mot de passe
  const passwordHash = await hashPassword(password);

  // Créer l'admin avec le tenantId
  const admin = await prisma.adminUser.create({
    data: {
      username,
      passwordHash,
      role,
      tenantId: requiredTenantId,
    },
  });

  // Générer le token JWT avec tenantId
  const token = generateToken({
    id: admin.id,
    username: admin.username,
    role: admin.role,
    tenantId: admin.tenantId,
  });

  return {
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    },
    token,
  };
};