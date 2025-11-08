// __tests__/unit/common/filters/resolve-exception-details.spec.ts
import {
  resolveExceptionDetails,
  extractHttpExceptionMessage,
  isFaviconRequest,
} from '@/common/filters/helpers/resolve-exception-details';
import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';

describe('Exception Resolution Helpers', () => {
  describe('resolveExceptionDetails', () => {
    it('extracts status and message from HttpException', () => {
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);
      const result = resolveExceptionDetails(exception);

      expect(result.status).toBe(HttpStatus.NOT_FOUND);
      expect(result.message).toBe('Not found');
    });

    it('extracts message from Error instance', () => {
      const exception = new Error('Database connection failed');
      const result = resolveExceptionDetails(exception);

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe('Database connection failed');
    });

    it('defaults to 500 for unknown exception types', () => {
      const result = resolveExceptionDetails('unknown error string');

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe('Internal server error');
    });
  });

  describe('extractHttpExceptionMessage', () => {
    it('extracts string response', () => {
      const result = extractHttpExceptionMessage('Simple error');
      expect(result).toBe('Simple error');
    });

    it('extracts message from object', () => {
      const result = extractHttpExceptionMessage({ message: 'Object error' });
      expect(result).toBe('Object error');
    });

    it('returns default for missing message', () => {
      const result = extractHttpExceptionMessage({ status: 400 });
      expect(result).toBe('Internal server error');
    });
  });

  describe('isFaviconRequest', () => {
    it('returns true for favicon.ico', () => {
      expect(isFaviconRequest('/favicon.ico')).toBe(true);
    });

    it('returns false for other URLs', () => {
      expect(isFaviconRequest('/api/users')).toBe(false);
      expect(isFaviconRequest('/health')).toBe(false);
    });
  });
});
