/**
 * User DTO.
 * @file 用户模块数据传输对象
 * @module module/user/DTO
 * @author Ryan <https://github.com/sirm2z>
 */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserLoginDTO {
  @ApiModelProperty()
  @IsNotEmpty({ message: '邮箱？' })
  email: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '密码？' })
  password: string;
}

export class UserRegisterDTO {
  @ApiModelProperty()
  @IsNotEmpty({ message: '用户名？' })
  username: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '邮箱？' })
  email: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '密码？' })
  password: string;

  roles?: string;
}

export class UserUpdateDTO {
  @ApiModelProperty()
  @IsString()
  username: string;

  @ApiModelProperty()
  @IsString()
  password: string;
}

export class UserRo {
  id: string;
  email: string;
  username: string;
  created: string;
  roles: string;
  token?: string;
}

export class UserPaginateRo {
  data: UserRo[];
  total: number;
  currentPage: number;
  totalPage: number;
  perPage: number;
}

export type OrderString = 'ASC' | 'DESC';
