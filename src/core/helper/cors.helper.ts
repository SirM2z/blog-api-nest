/**
 * Cors helper.
 * @file cors options 配置 具体参考 https://github.com/expressjs/cors#configuration-options
 * @module core/helper/cors
 * @author Ryan <https://github.com/sirm2z>
 */

import { HttpStatus } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { isDevMode } from '../../app.environment';
import * as APP_CONFIG from '../../app.config';

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      APP_CONFIG.CROSS_DOMAIN.allowedOrigins.includes(origin) ||
      isDevMode
    ) {
      callback(null, true);
    }
  },
  allowedHeaders: APP_CONFIG.CROSS_DOMAIN.allowedHeaders.join(','),
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  maxAge: APP_CONFIG.CROSS_DOMAIN.maxAge,
  preflightContinue: false,
  optionsSuccessStatus: HttpStatus.NO_CONTENT,
};
