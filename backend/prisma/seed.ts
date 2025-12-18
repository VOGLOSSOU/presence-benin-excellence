import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Créer le system admin (super utilisateur)
  console.log('👑 Creating system admin...');

  const systemPassword = 'System@123';
  const systemPasswordHash = await bcrypt.hash(systemPassword, 10);

  await prisma.adminUser.upsert({
    where: { username: 'system_admin' },
    update: {},
    create: {
      username: 'system_admin',
      passwordHash: systemPasswordHash,
      role: AdminRole.SYSTEM_ADMIN,
      // tenantId: null (optionnel pour SYSTEM_ADMIN)
    },
  });

  console.log('✅ System admin created:');
  console.log('  - Username: system_admin');
  console.log('  - Password:', systemPassword);
  console.log('  - Role: SYSTEM_ADMIN');

  // Créer les tenants
  console.log('📍 Creating tenants...');
  
  const tenantCotonou = await prisma.tenant.upsert({
    where: { code: 'BE-COTONOU' },
    update: {},
    create: {
      name: 'BENIN EXCELLENCE Cotonou',
      code: 'BE-COTONOU',
      description: 'Siège de Cotonou',
      active: true,
    },
  });

  const tenantPortoNovo = await prisma.tenant.upsert({
    where: { code: 'BE-PORTO-NOVO' },
    update: {},
    create: {
      name: 'BENIN EXCELLENCE Porto-Novo',
      code: 'BE-PORTO-NOVO',
      description: 'Siège de Porto-Novo',
      active: true,
    },
  });

  console.log('✅ Tenants created:', {
    cotonou: tenantCotonou.name,
    portoNovo: tenantPortoNovo.name,
  });

  // Créer les admins pour chaque tenant
  console.log('👤 Creating admins...');
  
  const defaultPassword = 'Admin@123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const adminCotonou = await prisma.adminUser.upsert({
    where: { username: 'admin_cotonou' },
    update: {},
    create: {
      tenantId: tenantCotonou.id,
      username: 'admin_cotonou',
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  });

  const adminPortoNovo = await prisma.adminUser.upsert({
    where: { username: 'admin_porto' },
    update: {},
    create: {
      tenantId: tenantPortoNovo.id,
      username: 'admin_porto',
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  });

  console.log('✅ Admins created:');
  console.log('  - Cotonou:', {
    username: adminCotonou.username,
    password: defaultPassword,
    tenant: tenantCotonou.name,
  });
  console.log('  - Porto-Novo:', {
    username: adminPortoNovo.username,
    password: defaultPassword,
    tenant: tenantPortoNovo.name,
  });

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });