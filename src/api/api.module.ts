import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ApiController],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    MulterModule.register({
      dest: process.env.UPLOAD_PATH,
    }),
    SharedModule,
    AuthModule,
  ],
  providers: [ApiService],
})
export class ApiModule {}
