// src/common/filters/validation-exception.filter.ts
import {
  Catch,
  BadRequestException,
  ArgumentsHost,
  Injectable,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@/common/filters/base-exception.filter';
import { LoggerService } from '@/logger/logger.service';

@Injectable()
@Catch(BadRequestException)
export class ValidationExceptionFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const responseBody = exception.getResponse();
    let messages: string[] = [];

    // Safely extract messages
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

    this.handleResponse(host, 400, 'Validation failed', { errors: messages });
  }
}
