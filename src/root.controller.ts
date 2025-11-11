// src/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { RootService } from '@/root.service';

@Controller()
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
