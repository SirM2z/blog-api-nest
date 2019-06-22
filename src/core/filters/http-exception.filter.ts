/**
 * HttpException filter.
 * @file 全局异常拦截器
 * @module filter/http
 * @author Ryan <https://github.com/sirm2z>
 */

import * as lodash from 'lodash';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import {
  EHttpStatus,
  THttpErrorResponse,
  TExceptionOption,
  TMessage,
} from '../interfaces/http.interface';
import { isDevMode } from '../../app.environment';

/**
 * @class HttpExceptionFilter
 * @classdesc 拦截全局抛出的所有异常，同时任何错误将在这里被规范化输出 THttpErrorResponse
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest() || {};
    const response = ctx.getResponse();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message.error || exception.message || null
          : 'Internal Server Error',
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'HttpExceptionFilter',
      );
    } else {
      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(errorResponse),
        'HttpExceptionFilter',
      );
    }

    const errorOption: TExceptionOption = exception.getResponse() as TExceptionOption;
    const isString = (value): value is TMessage => lodash.isString(value);
    const errMessage = isString(errorOption)
      ? errorOption
      : errorOption.message;
    const errorInfo = isString(errorOption) ? null : errorOption.error;
    const parentErrorInfo = errorInfo ? String(errorInfo) : null;
    const isChildrenError = errorInfo && errorInfo.status && errorInfo.message;
    const resultError =
      (isChildrenError && errorInfo.message) || parentErrorInfo;
    const resultStatus = isChildrenError ? errorInfo.status : status;
    const data: THttpErrorResponse = {
      status: EHttpStatus.Error,
      message: errMessage,
      error: resultError,
      debug: isDevMode ? exception.stack : null,
    };
    // 对默认的 404 进行特殊处理
    if (status === HttpStatus.NOT_FOUND) {
      data.error = `资源不存在`;
      data.message = `接口 ${request.method} -> ${request.url} 无效`;
    }
    return response.status(resultStatus).json(data);
  }
}
