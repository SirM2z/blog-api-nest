/**
 * Cors middleware
 * @file CORS 中间件 - (已用 core/helper/cors.helper.ts 代替)
 * @module middleware/cors
 * @author Ryan <https://github.com/sirm2z>
 */

import { RequestMethod, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as APP_CONFIG from '../app.config';
import { isDevMode } from '../app.environment';

/**
 * @function corsMiddleware
 * @description 处理 CORS 跨域
 */
export function cors(req: Request, res: Response, next: () => void) {
  const getMethod = method => RequestMethod[method];
  const origins = req.headers.origin;
  const origin = (Array.isArray(origins) ? origins[0] : origins) || '';
  const allowedOrigins = [...APP_CONFIG.CROSS_DOMAIN.allowedOrigins];
  const allowedMethods = [
    RequestMethod.GET,
    RequestMethod.HEAD,
    RequestMethod.PUT,
    RequestMethod.PATCH,
    RequestMethod.POST,
    RequestMethod.DELETE,
  ];
  const allowedHeaders = [...APP_CONFIG.CROSS_DOMAIN.allowedHeaders];

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
  res.header(
    'Access-Control-Max-Age',
    APP_CONFIG.CROSS_DOMAIN.maxAge.toString(),
  );

  // OPTIONS Request
  if (req.method === getMethod(RequestMethod.OPTIONS)) {
    res.sendStatus(HttpStatus.NO_CONTENT);
  } else {
    next();
  }
}
