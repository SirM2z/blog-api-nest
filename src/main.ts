import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import * as appConfig from './app.config';
import { isProdMode, isDevMode } from './app.environment';

const port = appConfig.APP.PORT || 8080;

// 替换 console 为更统一友好的
const { log, warn, info } = console;
const color = c => (isDevMode ? c : '');
global.console = Object.assign(console, {
  log: (...args) => log('[log]', ...args),
  warn: (...args) =>
    warn(color('\x1b[33m%s\x1b[0m'), '[warn]', '[ryan]', ...args),
  info: (...args) =>
    info(color('\x1b[34m%s\x1b[0m'), '[info]', '[ryan]', ...args),
  error: (...args) =>
    info(color('\x1b[31m%s\x1b[0m'), '[error]', '[ryan]', ...args),
});

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    isProdMode ? { logger: false } : null,
  );
  app.use(helmet());
  app.use(compression());
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
