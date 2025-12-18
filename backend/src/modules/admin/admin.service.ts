import prisma from '../../config/database';

/**
 * Récupérer les statistiques de l'organisation
 */
export const getAdminStatsService = async (tenantId: string) => {
  console.log('🔍 [getAdminStatsService] Récupération stats pour tenant:', tenantId);

  // Récupérer les statistiques de l'organisation
  const [
    totalUsers,
    activeUsers,
    totalPresences,
    todayPresences,
    totalForms,
    activeForms,
  ] = await Promise.all([
    // Total utilisateurs dans l'organisation
    prisma.user.count({
      where: { tenantId }
    }),

    // Utilisateurs actifs (avec présences récentes)
    prisma.user.count({
      where: {
        tenantId,
        presences: {
          some: {
            timestamp: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
            }
          }
        }
      }
    }),

    // Total présences
    prisma.presence.count({
      where: { tenantId }
    }),

    // Présences aujourd'hui
    prisma.presence.count({
      where: {
        tenantId,
        timestamp: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Début de journée
          lt: new Date(new Date().setHours(23, 59, 59, 999)) // Fin de journée
        }
      }
    }),

    // Total formulaires
    prisma.formTemplate.count({
      where: { tenantId }
    }),

    // Formulaires actifs
    prisma.formTemplate.count({
      where: {
        tenantId,
        active: true
      }
    }),
  ]);

  const result = {
    totalUsers,
    activeUsers,
    totalPresences,
    todayPresences,
    totalForms,
    activeForms,
  };

  console.log('✅ [getAdminStatsService] Stats récupérées:', result);
  return result;
};

/**
 * Récupérer l'activité récente de l'organisation
 */
export const getAdminActivityService = async (tenantId: string) => {
  console.log('🔍 [getAdminActivityService] Récupération activité pour tenant:', tenantId);

  // Récupérer les dernières présences (avec utilisateurs)
  const recentPresences = await prisma.presence.findMany({
    where: { tenantId },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: 10
  });

  // Transformer en format d'activité
  const activities = recentPresences.map(presence => ({
    id: presence.id,
    type: 'presence',
    user: `${presence.user.firstName} ${presence.user.lastName}`,
    action: `a marqué sa présence (${presence.presenceType.toLowerCase()})`,
    time: presence.timestamp.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'success',
    timestamp: presence.timestamp
  }));

  // Trier par timestamp décroissant et prendre les 5 plus récentes
  const recentActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  console.log('✅ [getAdminActivityService] Activité récupérée:', recentActivities.length, 'éléments');
  return recentActivities;
};