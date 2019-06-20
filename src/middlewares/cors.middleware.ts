/**
 * Cors middleware
 * @file CORS 中间件
 * @module middleware/cors
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  Injectable,
  NestMiddleware,
  RequestMethod,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as appConfig from '../app.config';
import { isDevMode } from '../app.environment';

/**
 * @class CorsMiddleware
 * @classdesc 处理 CORS 跨域
 */
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const getMethod = method => RequestMethod[method];
    const origins = req.headers.origin;
    const origin = (Array.isArray(origins) ? origins[0] : origins) || '';
    const allowedOrigins = [...appConfig.CROSS_DOMAIN.allowedOrigins];
    const allowedMethods = [
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.PUT,
      RequestMethod.PATCH,
      RequestMethod.POST,
      RequestMethod.DELETE,
    ];
    const allowedHeaders = [...appConfig.CROSS_DOMAIN.allowedHeaders];

    // Allow Origin
    if (!origin || allowedOrigins.includes(origin) || isDevMode) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    // Headers
    res.header('Access-Control-Allow-Headers', allowedHeaders.join(','));
    res.header(
      'Access-Control-Allow-Methods',
      allowedMethods.map(getMethod).join(','),
    );
    res.header('Access-Control-Max-Age', appConfig.CROSS_DOMAIN.maxAge);
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('X-Powered-By', `Ryan ${appConfig.INFO.version}`);

    // OPTIONS Request
    if (req.method === getMethod(RequestMethod.OPTIONS)) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return next();
    }
  }
}
