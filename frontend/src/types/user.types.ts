export enum ProfileType {
  STUDENT = 'etudiant',
  PROFESSIONAL = 'professionnel',
  PUPIL = 'eleve',
  OTHER = 'autre'
}

export enum AdminRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER'
}

export interface BaseUser {
  id: string;
  uuid: string;
  lastName: string;
  firstName: string;
  profileType: ProfileType;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentUser extends BaseUser {
  profileType: ProfileType.STUDENT;
  university: string;
  studentId?: string;
}

export interface ProfessionalUser extends BaseUser {
  profileType: ProfileType.PROFESSIONAL;
  company: string;
  position?: string;
}

export interface PupilUser extends BaseUser {
  profileType: ProfileType.PUPIL;
  school: string;
  grade?: string;
}

export interface OtherUser extends BaseUser {
  profileType: ProfileType.OTHER;
  description?: string;
}

export type User = StudentUser | ProfessionalUser | PupilUser | OtherUser;

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  tenantId?: string; // null pour SYSTEM_ADMIN
  createdAt: Date;
}