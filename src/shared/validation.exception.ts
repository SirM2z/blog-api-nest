import { HttpException, HttpStatus } from '@nestjs/common';
import * as TEXT from '../constants/text.constant';

/**
 * @class ValidationException
 * @classdesc 400 -> 请求有问题，这个错误经常发生在错误内层，所以 code 没有意义
 * @example new ValidationException('错误信息')
 * @example new ValidationException(new Error())
 */
export class ValidationException extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.VALIDATION_EXCEPTION_DEFAULT, HttpStatus.BAD_REQUEST);
  }
}
