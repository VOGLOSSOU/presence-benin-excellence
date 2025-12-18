const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Vérification de la base de données...\n');

  try {
    // Vérifier les AdminUser
    console.log('👥 TABLE AdminUser:');
    console.log('==================');
    const admins = await prisma.adminUser.findMany({
      include: {
        tenant: true
      }
    });

    admins.forEach(admin => {
      console.log(`ID: ${admin.id}`);
      console.log(`Username: ${admin.username}`);
      console.log(`Role: ${admin.role}`);
      console.log(`TenantId: ${admin.tenantId || 'null'}`);
      console.log(`Tenant Name: ${admin.tenant?.name || 'N/A'}`);
      console.log('---');
    });

    console.log('\n🏢 TABLE Tenant:');
    console.log('===============');
    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            forms: true,
            admins: true,
            presences: true
          }
        }
      }
    });

    tenants.forEach(tenant => {
      console.log(`ID: ${tenant.id}`);
      console.log(`Name: ${tenant.name}`);
      console.log(`Code: ${tenant.code}`);
      console.log(`Active: ${tenant.active}`);
      console.log(`Users: ${tenant._count.users}`);
      console.log(`Forms: ${tenant._count.forms}`);
      console.log(`Admins: ${tenant._count.admins}`);
      console.log(`Presences: ${tenant._count.presences}`);
      console.log('---');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function checkForms() {
  console.log('🔍 Vérification des formulaires...\n');

  const forms = await prisma.formTemplate.findMany({
    where: { tenantId: 'de0a8e08-5e28-4593-8151-853f0f9e4aae' },
    select: {
      id: true,
      name: true,
      description: true,
      purpose: true,
      active: true
    }
  });

  console.log('📋 Formulaires pour Cotonou:');
  forms.forEach(form => {
    console.log(`  - ${form.name} (${form.purpose}): ${form.description}`);
  });
}

checkForms().then(() => checkDatabase());