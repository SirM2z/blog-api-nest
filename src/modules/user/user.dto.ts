/**
 * User DTO.
 * @file 用户模块数据传输对象
 * @module module/user/DTO
 * @author Ryan <https://github.com/sirm2z>
 */

import { IsNotEmpty } from 'class-validator';

export class UserDTO {
  @IsNotEmpty({ message: '用户名？' })
  username: string;

  @IsNotEmpty({ message: '密码？' })
  password: string;

  roles?: string;
}

export class UserRo {
  id: string;
  username: string;
  created: string;
  roles: string;
  token?: string;
}

export class UserPaginateRo {
  data: UserRo[];
  pagination: {
    total: number;
  };
}