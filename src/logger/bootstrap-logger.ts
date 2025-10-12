// src/logger/bootstrap-logger.ts
import { formatMessage } from '@/common/utils/logger.util';

export class BootstrapLogger {

  // Informational message
  static log(message: string, context?: string) {
    console.log(JSON.stringify(formatMessage('INFO', message, context)));
  }

  // Error with optional stack trace and context
  static error(message: string, trace?: string, context?: string) {
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
  static warn(message: string, context?: string) {
    console.warn(JSON.stringify(formatMessage('WARN', message, context)));
  }
}