/**
 * Error interceptor.
 * @file 错误拦截器 - (暂没有使用)
 * @module interceptor/error
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TMessage } from '../interfaces/http.interface';
import { CustomException } from '../exceptions/custom.exception';
import * as META from '../../constants/meta.constant';
import * as TEXT from '../../constants/text.constant';

/**
 * @class ErrorInterceptor
 * @classdesc 当控制器所需的 Promise service 发生错误时，错误将在此被捕获
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call$ = next.handle();
    const request = context.switchToHttp().getRequest();
    const target = context.getHandler();
    const statusCode = this.reflector.get<HttpStatus>(
      META.HTTP_ERROR_CODE,
      target,
    );
    const message =
      this.reflector.get<TMessage>(META.HTTP_ERROR_MESSAGE, target) ||
      TEXT.HTTP_DEFAULT_ERROR_TEXT;
    return call$.pipe(
      catchError(error => {
        // return Logger.error(
        //   `${request.method} ${request.url}`,
        //   JSON.stringify(error),
        //   'ErrorInterceptor',
        // );
        // throw new CustomException({ message, error }, statusCode);
        return throwError(new CustomException({ message, error }, statusCode));
      }),
    );
  }
}
