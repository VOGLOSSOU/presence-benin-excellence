import { AppError } from './AppError';
import { HTTP_STATUS } from '../../config/constants';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}