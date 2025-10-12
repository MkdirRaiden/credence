// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NODE_ENV } from '@/common/constants';
import { formatMessage } from '@/common/utils/logger.util';

@Injectable()
export class LoggerService {
  //properties
  private env: string;

  //dependency injection
  constructor(private readonly configService: ConfigService) {
    this.env = this.configService.get<string>('NODE_ENV', NODE_ENV);
  }

  // Informational message
  log(message: string, context?: string) {
    console.log(JSON.stringify(formatMessage('INFO', message, context)));
  }

  // Error with optional stack trace and context
  error(message: string, trace?: string, context?: string) {
    console.error(
      JSON.stringify(
        formatMessage(
          'ERROR',
          `${message}${trace ? ` | Trace: ${trace}` : ''}`,
          context,
        ),
      ),
    );
  }

  // Warning with optional context
  warn(message: string, context?: string) {
    console.warn(JSON.stringify(formatMessage('WARN', message, context)));
  }

  // Debugging information
  debug(message: string, context?: string) {
    if (this.env !== 'production') {
      console.debug(JSON.stringify(formatMessage('DEBUG', message, context)));
    }
  }

  // Detailed trace information, only in non-production
  verbose(message: string, context?: string) {
    if (this.env !== 'production') {
      console.debug(JSON.stringify(formatMessage('VERBOSE', message, context)));
    }
  }
}  