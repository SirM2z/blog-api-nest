/**
 * App entry.
 * @file Index 入口文件
 * @module app/main
 * @author Ryan <https://github.com/sirm2z>
 */

import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as APP_CONFIG from './app.config';
import { AppModule } from './app.module';
import { corsOptions } from './core/helper/cors.helper';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { ValidationPipe } from './core/pipes/validation.pipe';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
// import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';

const port = APP_CONFIG.APP.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.use(compression());
  app.enableCors(corsOptions);
  app.useStaticAssets(join(__dirname, '..', APP_CONFIG.APP.UPLOAD_PATH));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    // new ErrorInterceptor(new Reflector()),
    new LoggingInterceptor(),
  );
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
