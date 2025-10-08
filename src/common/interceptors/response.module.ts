import { Module } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';

@Module({
  providers: [ResponseInterceptor],
  exports: [ResponseInterceptor],
})
export class InterceptorsModule {}
