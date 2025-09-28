// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_ENV } from '../common/constants';
import { formatMessage } from '../common/utils/logger.util';

@Injectable()
export class LoggerService {
  //properties
  private env: string;

  //dependency injection
  constructor(private readonly configService: ConfigService) {
    // Dynamically get environment from config
    this.env = this.configService.get<string>('NODE_ENV', DEFAULT_ENV);
  }

  //public methods for different log levels
  log(message: string, context?: string) {
    console.log(JSON.stringify(formatMessage('INFO', message, context)));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(
      JSON.stringify(
        formatMessage('ERROR', `${message}${trace ? ` | Trace: ${trace}` : ''}`, context)
      )
    );
  }

  warn(message: string, context?: string) {
    console.warn(JSON.stringify(formatMessage('WARN', message, context)));
  }

  debug(message: string, context?: string) {
    if (this.env !== 'production') {
      console.debug(JSON.stringify(formatMessage('DEBUG', message, context)));
    }
  }

  verbose(message: string, context?: string) {
    if (this.env !== 'production') {
      console.debug(JSON.stringify(formatMessage('VERBOSE', message, context)));
    }
  }
}
