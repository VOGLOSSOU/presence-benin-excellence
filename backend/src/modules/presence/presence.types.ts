import { PresenceType } from '@prisma/client';

export interface RecordPresenceRequest {
  uuidCode: string;
  formTemplateId: string;
}

export interface RecordPresenceResponse {
  presence: {
    id: string;
    presenceType: PresenceType;
    timestamp: Date;
    user: {
      uuidCode: string;
      firstName: string;
      lastName: string;
    };
  };
  message: string;
}