import { Catch, ArgumentsHost, HttpStatus, Injectable } from '@nestjs/common';
import { ValidationError } from 'joi';
import { BaseExceptionFilter } from './base-exception.filter';
import { gracefulShutdown } from '../utils/shutdown.util';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
@Catch(ValidationError)
export class ConfigValidationExceptionFilter extends BaseExceptionFilter<ValidationError> {

  constructor(protected readonly logger: LoggerService) {
      super(logger);
    }
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
