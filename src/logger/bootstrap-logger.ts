import { formatMessage } from '../common/utils/logger.util';

export class BootstrapLogger {
  static log(message: string, context?: string) {
    console.log(JSON.stringify(formatMessage('INFO', message, context)));
  }

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

  static warn(message: string, context?: string) {
    console.warn(JSON.stringify(formatMessage('WARN', message, context)));
  }
}
