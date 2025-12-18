const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanCotonouForms() {
  console.log('🧹 Nettoyage des formulaires de Cotonou...\n');

  try {
    // Trouver le tenant Cotonou
    const cotonouTenant = await prisma.tenant.findUnique({
      where: { code: 'BE-COTONOU' }
    });

    if (!cotonouTenant) {
      console.log('❌ Tenant Cotonou non trouvé');
      return;
    }

    console.log(`🏢 Tenant trouvé: ${cotonouTenant.name} (${cotonouTenant.id})`);

    // Compter les formulaires avant suppression
    const formsCount = await prisma.formTemplate.count({
      where: { tenantId: cotonouTenant.id }
    });

    console.log(`📋 Nombre de formulaires à supprimer: ${formsCount}`);

    if (formsCount === 0) {
      console.log('✅ Aucun formulaire à supprimer');
      return;
    }

    // Supprimer les formulaires (Prisma gère automatiquement les suppressions en cascade)
    const deleteResult = await prisma.formTemplate.deleteMany({
      where: { tenantId: cotonouTenant.id }
    });

    console.log(`✅ ${deleteResult.count} formulaires supprimés avec succès`);
    console.log('   (Les champs et intervalles associés ont été supprimés automatiquement)');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour vérifier après nettoyage
async function verifyClean() {
  console.log('\n🔍 Vérification après nettoyage...\n');

  try {
    const cotonouTenant = await prisma.tenant.findUnique({
      where: { code: 'BE-COTONOU' }
    });

    if (!cotonouTenant) {
      console.log('❌ Tenant Cotonou non trouvé');
      return;
    }

    const remainingForms = await prisma.formTemplate.count({
      where: { tenantId: cotonouTenant.id }
    });

    console.log(`📊 Formulaires restants pour Cotonou: ${remainingForms}`);

    if (remainingForms === 0) {
      console.log('✅ Nettoyage réussi !');
    } else {
      console.log('⚠️ Il reste des formulaires');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le nettoyage
async function main() {
  await cleanCotonouForms();
  await verifyClean();
}

main();