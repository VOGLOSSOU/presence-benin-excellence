import prisma from '../../config/database';
import { hashPassword } from '../../utils/password.util';
import { generateToken } from '../../utils/jwt.util';
import { CreateOrganizationRequest, CreateOrganizationResponse, SystemStats } from './setup.types';
import { AdminRole } from '@prisma/client';

/**
 * Génère un code unique pour l'organisation basé sur la ville
 */
const generateUniqueTenantCode = async (organizationName: string): Promise<string> => {
  // Extraire la ville (tout après "BENIN EXCELLENCE")
  const ville = organizationName.replace(/^BENIN EXCELLENCE\s+/i, '').trim();

  // Nettoyer : majuscules, supprimer caractères spéciaux, limiter à 8 caractères
  const villeClean = ville.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8);

  // Code de base
  const baseCode = `BE-${villeClean}`;

  // Vérifier l'unicité et ajouter numéro si nécessaire
  let counter = 1;
  let finalCode = baseCode;

  while (await prisma.tenant.findUnique({ where: { code: finalCode } })) {
    finalCode = `${baseCode}${counter}`;
    counter++;

    // Sécurité : éviter boucle infinie
    if (counter > 99) {
      throw new Error('Impossible de générer un code unique pour cette organisation');
    }
  }

  return finalCode;
};

/**
 * Créer une nouvelle organisation avec son premier super admin
 */
export const createOrganizationService = async (
  data: CreateOrganizationRequest,
  currentUserRole?: AdminRole
): Promise<CreateOrganizationResponse> => {
  const { organizationName, adminUsername, adminPassword } = data;

  // Générer un code unique basé sur la ville
  const code = await generateUniqueTenantCode(organizationName);

  // Vérifier que l'username admin n'existe pas
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: adminUsername }
  });

  if (existingAdmin) {
    throw new Error('Ce nom d\'utilisateur admin existe déjà');
  }

  // Hasher le mot de passe
  const passwordHash = await hashPassword(adminPassword);

  // Créer l'organisation et l'admin en transaction
  const result = await prisma.$transaction(async (tx) => {
    // Créer le tenant
    const tenant = await tx.tenant.create({
      data: {
        name: organizationName,
        code,
        description: `Organisation ${organizationName}`,
        active: true,
      },
    });

    // Créer le super admin
    const admin = await tx.adminUser.create({
      data: {
        username: adminUsername,
        passwordHash,
        role: AdminRole.SUPER_ADMIN,
        tenantId: tenant.id,
      },
    });

    return { tenant, admin };
  });

  // Générer le token JWT pour l'admin seulement si ce n'est pas un SYSTEM_ADMIN qui fait la création
  // (Un SYSTEM_ADMIN garde son propre token, le token retourné serait inutile)
  const token = currentUserRole === AdminRole.SYSTEM_ADMIN ? undefined : generateToken({
    id: result.admin.id,
    username: result.admin.username,
    role: result.admin.role,
    tenantId: result.admin.tenantId!,
  });

  return {
    tenant: {
      id: result.tenant.id,
      name: result.tenant.name,
      code: result.tenant.code,
      description: result.tenant.description || undefined,
      active: result.tenant.active,
      createdAt: result.tenant.createdAt.toISOString(),
    },
    admin: {
      id: result.admin.id,
      username: result.admin.username,
      role: result.admin.role,
      tenantId: result.admin.tenantId!,
    },
    token,
  };
};

/**
 * Récupérer toutes les organisations (SYSTEM_ADMIN uniquement)
 */
export const getAllOrganizationsService = async () => {
  console.log('🔍 [getAllOrganizationsService] Récupération des organisations...');

  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          users: true,
          forms: true,
          admins: true,
          presences: true,
        },
      },
      admins: {
        where: {
          role: AdminRole.SUPER_ADMIN,
        },
        select: {
          id: true,
          username: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log('📊 [getAllOrganizationsService] Tenants trouvés:', tenants.length);
  console.log('📋 [getAllOrganizationsService] Détails:', tenants.map(t => ({
    id: t.id,
    name: t.name,
    code: t.code,
    adminsCount: t.admins.length
  })));

  const result = tenants.map(tenant => ({
    id: tenant.id,
    name: tenant.name,
    code: tenant.code,
    description: tenant.description,
    active: tenant.active,
    status: tenant.active ? 'active' : 'inactive',  // ← AJOUTÉ
    createdAt: tenant.createdAt.toISOString(),
    adminUsername: tenant.admins[0]?.username || null,
    adminId: tenant.admins[0]?.id || null,
    usersCount: tenant._count.users,
    formsCount: tenant._count.forms,
    adminsCount: tenant._count.admins,
    presencesCount: tenant._count.presences,
  }));

  console.log('✅ [getAllOrganizationsService] Résultat final:', result.length, 'organisations');

  return result;
};

/**
 * Récupérer les statistiques globales du système
 */
export const getSystemStatsService = async (): Promise<SystemStats> => {
  const [
    totalOrganizations,
    totalUsers,
    totalPresences,
  ] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.presence.count(),
  ]);

  // Logique simple pour la santé du système
  let systemHealth: 'healthy' | 'warning' | 'error' = 'healthy';

  if (totalOrganizations === 0) {
    systemHealth = 'warning';
  }

  return {
    totalOrganizations,
    totalUsers,
    totalPresences,
    systemHealth,
  };
};

/**
 * Reset le mot de passe d'un admin
 */
export const resetAdminPasswordService = async (adminId: string, newPassword: string) => {
  // Vérifier que l'admin existe
  const admin = await prisma.adminUser.findUnique({
    where: { id: adminId },
    include: { tenant: true },
  });

  if (!admin) {
    throw new Error('Admin introuvable');
  }

  // Hasher le nouveau mot de passe
  const hashedPassword = await hashPassword(newPassword);

  // Mettre à jour le mot de passe
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { passwordHash: hashedPassword },
  });

  return {
    adminId,
    username: admin.username,
    tenantName: admin.tenant?.name || 'Système',
    message: 'Mot de passe réinitialisé avec succès',
  };
};

/**
 * Désactiver une organisation
 */
export const deactivateOrganizationService = async (tenantId: string) => {
  // Vérifier que l'organisation existe
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new Error('Organisation introuvable');
  }

  // Désactiver l'organisation
  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: { active: false },
  });

  return {
    tenantId,
    name: updatedTenant.name,
    active: updatedTenant.active,
    message: 'Organisation désactivée avec succès',
  };
};

/**
 * Réactiver une organisation
 */
export const activateOrganizationService = async (tenantId: string) => {
  // Vérifier que l'organisation existe
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new Error('Organisation introuvable');
  }

  // Réactiver l'organisation
  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: { active: true },
  });

  return {
    tenantId,
    name: updatedTenant.name,
    active: updatedTenant.active,
    message: 'Organisation réactivée avec succès',
  };
};

/**
 * Supprimer une organisation
 */
export const deleteOrganizationService = async (tenantId: string) => {
  // Vérifier que l'organisation existe
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new Error('Organisation introuvable');
  }

  // Supprimer l'organisation (Prisma gère automatiquement les suppressions en cascade)
  await prisma.tenant.delete({
    where: { id: tenantId },
  });

  return {
    tenantId,
    name: tenant.name,
    message: 'Organisation supprimée avec succès',
  };
};

/**
 * Récupérer les informations d'un tenant
 */
export const getTenantInfoService = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  if (!tenant) {
    throw new Error('Organisation introuvable');
  }

  return tenant;
};

/**
 * Récupérer une organisation par son code (public)
 */
export const getTenantByCodeService = async (code: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { code: code.toUpperCase() },
    select: {
      id: true,
      name: true,
      code: true,
      active: true,
    },
  });

  if (!tenant) {
    throw new Error('Organisation introuvable avec ce code');
  }

  if (!tenant.active) {
    throw new Error('Cette organisation est désactivée');
  }

  return tenant;
};