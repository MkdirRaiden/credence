// src/features/users/services/users-conflict.service.ts
import { Injectable } from '@nestjs/common';
import { UsersConflictRepository } from '@/features/users/repositories';
import { CreateUserDto, UpdateUserDto } from '@/features/users/dtos';
import {
  EmailAlreadyInUseException,
  UsernameAlreadyInUseException,
  PhoneAlreadyInUseException,
} from '@/common/exceptions';

@Injectable()
export class UsersConflictService {
  constructor(private readonly conflictRepo: UsersConflictRepository) {}

  async ensureCreateConstraints(dto: CreateUserDto): Promise<void> {
    if (dto.email) {
      const emailTaken = await this.conflictRepo.isEmailTaken(dto.email);
      if (emailTaken) throw new EmailAlreadyInUseException(dto.email);
    }

    if (dto.username) {
      const usernameTaken = await this.conflictRepo.isUsernameTaken(
        dto.username,
      );
      if (usernameTaken) throw new UsernameAlreadyInUseException(dto.username);
    }

    if (dto.phone) {
      const phoneTaken = await this.conflictRepo.isPhoneTaken(dto.phone);
      if (phoneTaken) throw new PhoneAlreadyInUseException(dto.phone);
    }
  }

  async ensureUpdateConstraints(
    _userId: string,
    dto: UpdateUserDto,
  ): Promise<void> {
    if (!dto.username) return;

    const usernameTaken = await this.conflictRepo.isUsernameTaken(dto.username);
    if (usernameTaken) throw new UsernameAlreadyInUseException(dto.username);
  }
}
