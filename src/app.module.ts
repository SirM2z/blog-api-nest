/**
 * App module.
 * @file App 主模块
 * @module app/module
 * @author Ryan <https://github.com/sirm2z>
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import * as APP_CONFIG from './app.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(APP_CONFIG.POSTGRESQL),
    MulterModule.register({
      dest: APP_CONFIG.APP.UPLOAD_PATH,
    }),
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
