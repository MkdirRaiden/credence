// src/root.controller.ts
import { Controller, Get, HttpCode } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { RootService } from '@/root.service';
import { AppInfoDto } from '@/common/dtos';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@SkipThrottle()
@ApiTags('root')
export class RootController {
  constructor(private readonly rootService: RootService) {}

  /**
   * Returns application metadata and configuration.
   */
  @Get()
  @HttpCode(200)
  @ApiOkResponse({
    type: AppInfoDto,
    description: 'Application metadata',
  })
  getInfo(): AppInfoDto {
    return this.rootService.appInfo();
  }
}
