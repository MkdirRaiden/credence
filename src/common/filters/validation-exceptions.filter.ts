// src/common/filters/validation-exceptions.filter.ts
import {
  Catch,
  BadRequestException,
  ArgumentsHost,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@/common/filters/base/base-exception.filter';
import { LoggerService } from '@/logger/services';
import * as helpers from '@/common/filters/helpers';

@Injectable()
@Catch(BadRequestException)
export class ValidationExceptionFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const responseBody = exception.getResponse();
    const message = helpers.extractValidationMessage(responseBody);
    this.handleResponse(host, HttpStatus.BAD_REQUEST, message, exception);
  }
}
