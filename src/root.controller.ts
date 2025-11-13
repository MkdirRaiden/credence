// src/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { RootService } from '@/root.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
@SkipThrottle()
export class RootController {
  constructor(private readonly rootService: RootService) {}
  /**
   * Returns application metadata and configuration.
   */
  @Get()
  getInfo() {
    return this.rootService.appInfo();
  }
}
