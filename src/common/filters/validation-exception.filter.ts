// src/common/filters/validation-exception.filter.ts
import {
  Catch,
  BadRequestException,
  ArgumentsHost,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@/common/filters/base-exception.filter';
import { LoggerService } from '@/logger/logger.service';

/**
 * Handles validation errors and extracts detailed error messages.
 */
@Injectable()
@Catch(BadRequestException)
export class ValidationExceptionFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const message = this.extractValidationMessage(exception);
    this.handleResponse(host, HttpStatus.BAD_REQUEST, message, exception);
  }

  private extractValidationMessage(exception: BadRequestException): string {
    const responseBody = exception.getResponse();
    let messages: string[] = [];

    if (typeof responseBody === 'string') {
      messages = [responseBody];
    } else if (
      responseBody &&
      typeof responseBody === 'object' &&
      'message' in responseBody
    ) {
      const msg = (responseBody as { message?: string | string[] }).message;
      if (Array.isArray(msg)) {
        messages = msg;
      } else if (typeof msg === 'string') {
        messages = [msg];
      }
    }

    return messages.length > 0 ? messages.join(', ') : 'Validation failed';
  }
}
