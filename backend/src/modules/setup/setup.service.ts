import prisma from '../../config/database';
import { hashPassword } from '../../utils/password.util';
import { ConflictError } from '../../shared/errors';
import { CreateOrganizationRequest, CreateOrganizationResponse } from './setup.types';
import { AdminRole } from '@prisma/client';
import { TENANT_CODE_PREFIX } from '../../config/constants';

/**
 * Génère un code unique pour le tenant
 */
function generateTenantCode(organizationName: string): string {
  // Nettoyer le nom : enlever espaces, caractères spéciaux, mettre en majuscules
  const cleanName = organizationName
    .replace(/[^a-zA-Z0-9\s]/g, '') // Enlever caractères spéciaux
    .replace(/\s+/g, '') // Enlever espaces
    .toUpperCase();

  return `${TENANT_CODE_PREFIX}${cleanName}`;
}

/**
 * Service de création d'une organisation (tenant + super admin)
 */
export const createOrganizationService = async (
  data: CreateOrganizationRequest
): Promise<CreateOrganizationResponse> => {
  const { organizationName, adminUsername, adminPassword } = data;

  // Générer le code du tenant
  const code = generateTenantCode(organizationName);

  // Vérifier que le code est unique
  const existingTenant = await prisma.tenant.findUnique({
    where: { code },
  });

  if (existingTenant) {
    throw new ConflictError('An organization with this name already exists');
  }

  // Vérifier que le username admin est unique
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    throw new ConflictError('Admin username already exists');
  }

  // Hasher le mot de passe
  const passwordHash = await hashPassword(adminPassword);

  // Transaction atomique : créer tenant + admin
  const result = await prisma.$transaction(async (tx) => {
    // 1. Créer le tenant
    const tenant = await tx.tenant.create({
      data: {
        name: organizationName,
        code,
        active: true,
      },
    });

    // 2. Créer le super admin
    const admin = await tx.adminUser.create({
      data: {
        tenantId: tenant.id,
        username: adminUsername,
        passwordHash,
        role: AdminRole.SUPER_ADMIN,
      },
    });

    return { tenant, admin };
  });

  return {
    tenant: {
      id: result.tenant.id,
      name: result.tenant.name,
      code: result.tenant.code,
    },
    admin: {
      id: result.admin.id,
      username: result.admin.username,
      role: result.admin.role,
    },
    credentials: {
      username: adminUsername,
      password: adminPassword, // Retourner le mot de passe en clair pour info
    },
  };
};