import { formatMessage } from '@/common/utils/logger.util';
import { NODE_ENV, DEFAULT_CONTEXT } from '@/common/constants';

describe('formatMessage', () => {
  it('should format a log message with all fields', () => {
    const log = formatMessage('INFO', 'Test message', 'MyContext', 'test-env');

    expect(log.level).toBe('INFO');
    expect(log.message).toBe('Test message');
    expect(log.context).toBe('MyContext');
    expect(log.env).toBe('test-env');
    expect(new Date(log.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('should apply defaults when context and env are not provided', () => {
    const log = formatMessage('ERROR', 'Default test');

    expect(log.context).toBe(DEFAULT_CONTEXT);
    expect(log.env).toBe(NODE_ENV);
    expect(log.message).toBe('Default test');
    expect(log.level).toBe('ERROR');
  });
});
