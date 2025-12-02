import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd MMMM yyyy', { locale: fr });
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'HH:mm:ss');
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const formatUUID = (uuid: string): string => {
  return uuid.toUpperCase();
};

export const validateUUID = (uuid: string): boolean => {
  return /^BE-[A-Z0-9]{7}$/.test(uuid.toUpperCase());
};

export const formatPresenceType = (type: string): string => {
  switch (type) {
    case 'ARRIVAL':
      return 'Arrivée';
    case 'DEPARTURE':
      return 'Départ';
    case 'SIMPLE':
      return 'Présence';
    default:
      return type;
  }
};

export const formatProfileType = (type: string): string => {
  switch (type) {
    case 'STUDENT':
      return 'Étudiant';
    case 'PROFESSIONAL':
      return 'Professionnel';
    case 'PUPIL':
      return 'Élève';
    case 'OTHER':
      return 'Autre';
    default:
      return type;
  }
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};