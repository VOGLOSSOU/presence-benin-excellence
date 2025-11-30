import { AppError } from './AppError';
import { HTTP_STATUS } from '../../config/constants';

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}