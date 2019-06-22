/**
 * Logging interceptor.
 * @file 日志拦截器
 * @module interceptor/logging
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    // 过滤 GraphQL
    if (req) {
      const { method, url } = req;
      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${method} ${url} ${Date.now() - now}ms`,
              context.getClass().name,
            ),
          ),
        );
    } else {
      return next.handle();
    }
  }
}
