// __tests__/unit/common/filters/extract-validation-message.spec.ts
import { extractValidationMessage } from '@/common/filters/helpers/extract-validation-message';


describe('extractValidationMessage Helper', () => {
  it('extracts string message', () => {
    const result = extractValidationMessage('Invalid input');
    expect(result).toBe('Invalid input');
  });

  it('extracts array of messages', () => {
    const result = extractValidationMessage({
      message: ['email is required', 'password must be 8+ chars'],
    });

    expect(result).toContain('email is required');
    expect(result).toContain('password must be 8+ chars');
  });

  it('extracts single message from object', () => {
    const result = extractValidationMessage({ message: 'Invalid format' });
    expect(result).toBe('Invalid format');
  });

  it('returns default for missing message', () => {
    const result = extractValidationMessage({ status: 400 });
    expect(result).toBe('Validation failed');
  });

  it('joins multiple messages with comma', () => {
    const result = extractValidationMessage({
      message: ['error1', 'error2', 'error3'],
    });

    expect(result).toBe('error1, error2, error3');
  });
});
