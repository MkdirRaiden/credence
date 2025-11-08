// __tests__/unit/common/utils/prisma-select.spec.ts
import { createPrismaSelect } from '@/common/utils/prisma-select';
import type {
  FieldVisibility,
  FieldSelectorContext,
} from '@/common/interfaces';

describe('createPrismaSelect Utility', () => {
  const fieldVisibility: FieldVisibility = {
    id: ['public', 'self', 'admin'],
    name: ['public', 'self', 'admin'],
    email: ['self', 'admin'],
    password: ['admin'],
    role: ['admin'],
    internalNotes: ['admin'],
  };

  it('filters fields based on visibility level', () => {
    const testCases = [
      {
        level: 'public' as const,
        expected: {
          id: true,
          name: true,
          email: false,
          password: false,
          role: false,
          internalNotes: false,
        },
      },
      {
        level: 'self' as const,
        expected: {
          id: true,
          name: true,
          email: true,
          password: false,
          role: false,
          internalNotes: false,
        },
      },
      {
        level: 'admin' as const,
        expected: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          internalNotes: true,
        },
      },
    ];

    testCases.forEach(({ level, expected }) => {
      const context: FieldSelectorContext = { level };
      const result = createPrismaSelect(fieldVisibility, context);
      expect(result).toEqual(expected);
    });
  });

  it('handles empty field visibility', () => {
    const context: FieldSelectorContext = { level: 'public' };
    const result = createPrismaSelect({}, context);
    expect(result).toEqual({});
  });
});
