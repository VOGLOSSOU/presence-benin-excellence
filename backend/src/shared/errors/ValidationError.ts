import { AppError } from './AppError';
import { HTTP_STATUS } from '../../config/constants';

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', public errors?: any) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }
}