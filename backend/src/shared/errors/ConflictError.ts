import { AppError } from './AppError';
import { HTTP_STATUS } from '../../config/constants';

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}