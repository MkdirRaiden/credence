import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'joi';
import { BaseExceptionFilter } from './base-exception.filter';
import { gracefulShutdown } from '../utils/shutdown.util';

@Catch(ValidationError)
export class ConfigValidationExceptionFilter extends BaseExceptionFilter<ValidationError> {

  catch(exception: ValidationError, host: ArgumentsHost) {
    this.handleResponse(
      host,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Application configuration validation failed.',
      exception,
    );

    // Shutdown since config is invalid
    gracefulShutdown(this.logger, 'Critical configuration validation failure — shutting down application...');
  }
}
