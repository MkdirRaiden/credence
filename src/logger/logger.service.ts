// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogEntry, LogLevel } from './logger.interface';
import { DEFAULT_CONTEXT, DEFAULT_ENV } from '../common/constants';

@Injectable()
export class LoggerService {
  //properties
  private env: string;

  //dependency injection
  constructor(private readonly configService: ConfigService) {
    // Dynamically get environment from config
    this.env = this.configService.get<string>('NODE_ENV', DEFAULT_ENV);
  }

  //private method for formatting messages (cannot be accessed outside)
  private formatMessage(level: LogLevel, message: string, context?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      env: this.env,
      context: context || DEFAULT_CONTEXT,
      message,
    };
  }

  //public methods for different log levels
  log(message: string, context?: string) {
    console.log(JSON.stringify(this.formatMessage('INFO', message, context)));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(
      JSON.stringify(
        this.formatMessage('ERROR', `${message}${trace ? ` | Trace: ${trace}` : ''}`, context)
      )
    );
  }

  warn(message: string, context?: string) {
    console.warn(JSON.stringify(this.formatMessage('WARN', message, context)));
  }

  debug(message: string, context?: string) {
    if (this.env !== 'production') {
      console.debug(JSON.stringify(this.formatMessage('DEBUG', message, context)));
    }
  }

  verbose(message: string, context?: string) {
    if (this.env !== 'production') {
      console.debug(JSON.stringify(this.formatMessage('VERBOSE', message, context)));
    }
  }
}
