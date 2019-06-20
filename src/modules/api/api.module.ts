import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UserModule } from '../user/user.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '../../shared/http-exception.filter';
import { LoggingInterceptor } from '../../shared/logging.interceptor';
import * as appConfig from '../../app.config';

@Module({
  imports: [
    MulterModule.register({
      dest: appConfig.APP.UPLOAD_PATH,
    }),
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    ApiService,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
