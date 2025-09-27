// src/common/filters/validation-exception.filter.ts
import { Catch, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';

@Catch(BadRequestException)
export class ValidationExceptionFilter extends BaseExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const responseBody = exception.getResponse() as
      | string
      | { statusCode?: number; message?: string | string[] };

    let messages: string[] = [];

    if (typeof responseBody === 'string') {
      messages = [responseBody];
    } else if (Array.isArray(responseBody?.message)) {
      messages = responseBody.message;
    } else if (typeof responseBody?.message === 'string') {
      messages = [responseBody.message];
    }

    // Use the centralized handleResponse to log and send standardized JSON
    this.handleResponse(
      host,
      400,
      'Validation failed',
      { errors: messages }
    );
  }
}
