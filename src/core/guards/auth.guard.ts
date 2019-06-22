/**
 * Auth guard.
 * @file 鉴权卫士
 * @module guard/auth
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as APP_CONFIG from '../../app.config';

/**
 * @class AuthGuard
 * @classdesc 检验规则：Token 是否存在 -> Token 是否在有效期内 -> Token 解析出的数据是否对的上
 * @example @UseGuards(AuthGuard)
 */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // 过滤 GraphQL
    if (request) {
      if (!request.headers.authorization) {
        return false;
      }
      request.user = await this.validateToken(request.headers.authorization);
      return true;
    } else {
      return true;
    }
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    try {
      const token = auth.split(' ')[1];
      const decoded = await jwt.verify(token, APP_CONFIG.AUTH.jwtTokenSecret);
      return decoded;
    } catch (error) {
      const message = 'Token error: ' + (error.message || error.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
