import prisma from '../../config/database';
import { NotFoundError, BadRequestError } from '../../shared/errors';
import { RecordPresenceRequest } from './presence.types';
import { getStartOfDay, getEndOfDay, getCurrentTime, isTimeInInterval } from '../../utils/date.util';
import { PresenceType } from '@prisma/client';

/**
 * Déterminer le type de présence (SIMPLE, ARRIVAL, DEPARTURE)
 */
const determinePresenceType = async (
  userId: string,
  formTemplateId: string
): Promise<PresenceType> => {
  // Récupérer le formulaire avec son type et intervalles
  const formTemplate = await prisma.formTemplate.findUnique({
    where: { id: formTemplateId },
    include: { intervals: true },
  });

  if (!formTemplate) {
    throw new NotFoundError('Form template not found');
  }

  // Si type SIMPLE_PRESENCE, retourner SIMPLE
  if (formTemplate.type === 'SIMPLE_PRESENCE') {
    return PresenceType.SIMPLE;
  }

  // Si type ARRIVAL_DEPARTURE
  const today = new Date();
  const startOfDay = getStartOfDay(today);
  const endOfDay = getEndOfDay(today);

  // Vérifier s'il y a déjà une présence aujourd'hui pour cet utilisateur et ce formulaire
  const todayPresences = await prisma.presence.findMany({
    where: {
      userId,
      formTemplateId,
      timestamp: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  // S'il n'y a pas de présence aujourd'hui, c'est une ARRIVAL
  if (todayPresences.length === 0) {
    return PresenceType.ARRIVAL;
  }

  // Vérifier la dernière présence
  const lastPresence = todayPresences[0];

  // Si la dernière était une ARRIVAL, c'est maintenant une DEPARTURE
  if (lastPresence.presenceType === PresenceType.ARRIVAL) {
    return PresenceType.DEPARTURE;
  }

  // Si la dernière était une DEPARTURE, c'est une nouvelle ARRIVAL (nouveau cycle)
  if (lastPresence.presenceType === PresenceType.DEPARTURE) {
    return PresenceType.ARRIVAL;
  }

  // Par défaut (ne devrait jamais arriver)
  return PresenceType.ARRIVAL;
};

/**
 * Enregistrer une présence
 */
export const recordPresenceService = async (data: RecordPresenceRequest) => {
  // 1. Vérifier que l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { uuidCode: data.uuidCode },
  });

  if (!user) {
    throw new NotFoundError('User not found with this UUID');
  }

  // 2. Vérifier que le formulaire existe et est actif
  const formTemplate = await prisma.formTemplate.findUnique({
    where: { id: data.formTemplateId },
    include: { intervals: true },
  });

  if (!formTemplate) {
    throw new NotFoundError('Form template not found');
  }

  if (!formTemplate.active) {
    throw new BadRequestError('Form template is not active');
  }

  // 3. Si ARRIVAL_DEPARTURE, vérifier qu'on est dans l'intervalle horaire
  if (formTemplate.type === 'ARRIVAL_DEPARTURE' && formTemplate.intervals.length > 0) {
    const interval = formTemplate.intervals[0];
    const currentTime = getCurrentTime();

    if (!isTimeInInterval(currentTime, interval.startTime, interval.endTime)) {
      throw new BadRequestError(
        `Outside allowed time interval (${interval.startTime} - ${interval.endTime})`
      );
    }
  }

  // 4. Déterminer le type de présence
  const presenceType = await determinePresenceType(user.id, data.formTemplateId);

  // 5. Enregistrer la présence
  const presence = await prisma.presence.create({
    data: {
      userId: user.id,
      formTemplateId: data.formTemplateId,
      presenceType,
    },
    include: {
      user: {
        select: {
          uuidCode: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // 6. Message personnalisé selon le type
  let message = '';
  if (presenceType === PresenceType.SIMPLE) {
    message = 'Presence recorded successfully';
  } else if (presenceType === PresenceType.ARRIVAL) {
    message = 'Arrival recorded successfully';
  } else if (presenceType === PresenceType.DEPARTURE) {
    message = 'Departure recorded successfully';
  }

  return {
    presence: {
      id: presence.id,
      presenceType: presence.presenceType,
      timestamp: presence.timestamp,
      user: presence.user,
    },
    message,
  };
};

/**
 * Obtenir l'historique des présences d'un utilisateur
 */
export const getUserPresencesService = async (uuidCode: string) => {
  // Vérifier que l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { uuidCode },
  });

  if (!user) {
    throw new NotFoundError('User not found with this UUID');
  }

  // Récupérer les présences
  const presences = await prisma.presence.findMany({
    where: { userId: user.id },
    include: {
      formTemplate: {
        select: {
          name: true,
          type: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
    take: 50, // Limite aux 50 dernières présences
  });

  return {
    user: {
      uuidCode: user.uuidCode,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    presences,
  };
};