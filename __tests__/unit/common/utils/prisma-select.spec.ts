// __tests__/unit/common/utils/prisma-select.spec.ts
import { createPrismaSelect } from '@/common/utils/prisma-select';
import type { FieldVisibility, FieldSelectorContext } from '@/common/interfaces';

describe('createPrismaSelect utility', () => {
  const fieldVisibility: FieldVisibility = {
    id: ['public', 'self', 'admin'],
    name: ['public', 'self', 'admin'],
    email: ['self', 'admin'],
    password: ['admin'],
    role: ['admin'],
    internalNotes: ['admin'],
  };

  it('returns correct select for public visibility level', () => {
    const context: FieldSelectorContext = {
      level: 'public',
    };

    const result = createPrismaSelect(fieldVisibility, context);

    expect(result).toEqual({
      id: true,
      name: true,
      email: false,
      password: false,
      role: false,
      internalNotes: false,
    });
  });

  it('returns correct select for self visibility level', () => {
    const context: FieldSelectorContext = {
      level: 'self',
      requesterId: 'user-456',
    };

    const result = createPrismaSelect(fieldVisibility, context);

    expect(result).toEqual({
      id: true,
      name: true,
      email: true,
      password: false,
      role: false,
      internalNotes: false,
    });
  });

  it('returns correct select for admin visibility level', () => {
    const context: FieldSelectorContext = {
      level: 'admin',
      requesterId: 'admin-789',
    };

    const result = createPrismaSelect(fieldVisibility, context);

    expect(result).toEqual({
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      internalNotes: true,
    });
  });

  it('handles empty field visibility', () => {
    const context: FieldSelectorContext = {
      level: 'public',
    };

    const result = createPrismaSelect({}, context);

    expect(result).toEqual({});
  });
});
