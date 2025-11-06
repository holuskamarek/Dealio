import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Globální exception filter pro jednotné zpracování chyb
 * Zachytává všechny výjimky a vrací standardizovaný formát
 * 
 * FIXME: Přidat error tracking (např. Sentry)
 * TODO: Přidat custom error messages v češtině
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Zjistíme status code a zprávu
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Interní chyba serveru';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    // Pokud má výjimka metodu getStatus, je to HttpException
    if (typeof exception?.getStatus === 'function') {
      status = exception.getStatus();
      
      const exceptionResponse = exception.getResponse();
      
      // Pokud je response objekt, použijeme jeho message
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = exceptionResponse.message || message;
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
      
      errorCode = this.getErrorCode(status);
    }

    // Loguj chybu
    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - ${message}`,
      exception.stack,
    );

    // Vytvoř standardizovaný formát
    const errorResponse = {
      success: false,
      error: errorCode,
      message: message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    return response.status(status).json(errorResponse);
  }

  /**
   * Vrátí error code na základě HTTP statusu
   */
  private getErrorCode(status: number): string {
    const errorCodes: { [key: number]: string } = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
    };

    return errorCodes[status] || 'UNKNOWN_ERROR';
  }
}

