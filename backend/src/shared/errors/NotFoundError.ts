import { AppError } from './AppError';
import { HTTP_STATUS } from '../../config/constants';

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}