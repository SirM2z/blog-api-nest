/**
 * Transform interceptor.
 * @file 请求流拦截器
 * @module interceptor/transform
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as TEXT from '../../constants/text.constant';
import * as META from '../../constants/meta.constant';
import {
  THttpSuccessResponse,
  IHttpResultPaginate,
  TMessage,
  EHttpStatus,
} from '../interfaces/http.interface';

// 转换为标准的数据结构
export function transformDataToPaginate<T>(
  serviceRes,
  request?: any,
): IHttpResultPaginate<T[]> {
  return {
    data: serviceRes.data,
    params: request ? request.queryParams : null,
    pagination: {
      total: serviceRes.total,
      current_page: serviceRes.currentPage,
      total_page: serviceRes.totalPage,
      per_page: serviceRes.perPage,
    },
  };
}

/**
 * @class TransformInterceptor
 * @classdesc 当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构 IHttpResultPaginate
 */
// export interface Response<T> {
//   data: T;
// }

// @Injectable()
// export class TransformInterceptor<T>
//   implements NestInterceptor<T, Response<T>> {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Observable<Response<T>> {
//     return next.handle().pipe(map(data => ({ data })));
//   }
// }

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, THttpSuccessResponse<T>> {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const target = context.getHandler();
    const request = context.switchToHttp().getRequest();
    const message =
      this.reflector.get<TMessage>(META.HTTP_SUCCESS_MESSAGE, target) ||
      TEXT.HTTP_DEFAULT_SUCCESS_TEXT;
    const usePaginate = this.reflector.get<boolean>(
      META.HTTP_RES_TRANSFORM_PAGINATE,
      target,
    );
    return next.handle().pipe(
      map((serviceRes: any) => {
        const result = !usePaginate
          ? serviceRes
          : transformDataToPaginate<T>(serviceRes, request);
        return { status: EHttpStatus.Success, message, result };
      }),
    );
  }
}
