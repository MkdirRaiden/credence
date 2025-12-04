// src/root.controller.ts
import { Controller, Get, HttpCode } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { RootService } from '@/root.service';
import { AppInfoDto } from '@/common/dtos';
import * as swagger from '@nestjs/swagger';

@swagger.ApiTags('root')
@Controller()
@SkipThrottle()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Get()
  @HttpCode(200)
  @swagger.ApiOkResponse({
    type: AppInfoDto,
    description: 'Application metadata',
  })
  getInfo(): AppInfoDto {
    return this.rootService.appInfo();
  }
}
