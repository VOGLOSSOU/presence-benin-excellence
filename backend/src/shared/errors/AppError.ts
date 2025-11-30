/**
 * Classe de base pour toutes les erreurs de l'application
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Maintient la stack trace correcte
    Error.captureStackTrace(this, this.constructor);
    
    // Définit le nom de l'erreur comme le nom de la classe
    this.name = this.constructor.name;
  }
}

export default AppError;

