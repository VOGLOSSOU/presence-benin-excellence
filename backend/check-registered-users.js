const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRegisteredUsers() {
  try {
    console.log('🔍 VÉRIFICATION DES UTILISATEURS ENREGISTRÉS\n');
    console.log('=' .repeat(60));

    // Récupérer tous les utilisateurs avec leurs données complètes
    const users = await prisma.user.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        fieldValues: {
          include: {
            fieldTemplate: {
              select: {
                label: true,
                systemField: true,
                fieldType: true,
              },
            },
          },
        },
        presences: {
          select: {
            id: true,
            presenceType: true,
            timestamp: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
        },
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

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur enregistré trouvé.');
      return;
    }

    console.log(`✅ ${users.length} utilisateur(s) trouvé(s) :\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. 👤 UTILISATEUR: ${user.firstName} ${user.lastName}`);
      console.log(`   📧 Email: ${user.email || 'Non spécifié'}`);
      console.log(`   📱 Téléphone: ${user.phone || 'Non spécifié'}`);
      console.log(`   🎓 Titre: ${user.title}`);
      console.log(`   🏢 Institution: ${user.institution || 'Non spécifiée'}`);
      console.log(`   🔢 UUID Code: ${user.uuidCode}`);
      console.log(`   📅 Créé le: ${user.createdAt.toLocaleString('fr-FR')}`);
      console.log(`   🏢 Organisation: ${user.tenant.name} (${user.tenant.code})`);
      console.log(`   📊 Statut: ${user.status}`);
      console.log(`   🕒 Nombre de présences: ${user._count.presences}`);

      // Afficher les valeurs des champs dynamiques
      if (user.fieldValues.length > 0) {
        console.log(`   📝 Champs personnalisés:`);
        user.fieldValues.forEach((fv) => {
          const fieldLabel = fv.fieldTemplate.label;
          const systemField = fv.fieldTemplate.systemField ? ` (${fv.fieldTemplate.systemField})` : '';
          console.log(`      • ${fieldLabel}${systemField}: ${fv.value}`);
        });
      }

      // Afficher les dernières présences
      if (user.presences.length > 0) {
        console.log(`   🕒 Dernières présences:`);
        user.presences.slice(0, 3).forEach((presence) => {
          const time = presence.timestamp.toLocaleString('fr-FR');
          console.log(`      • ${presence.presenceType} - ${time}`);
        });
        if (user.presences.length > 3) {
          console.log(`      ... et ${user.presences.length - 3} autres`);
        }
      }

      console.log(''); // Ligne vide entre utilisateurs
    });

    console.log('=' .repeat(60));
    console.log('✅ VÉRIFICATION TERMINÉE');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
checkRegisteredUsers();