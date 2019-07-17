/**
 * User service.
 * @file 用户模块服务
 * @module module/user/service
 * @author Ryan <https://github.com/sirm2z>
 */

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import {
  UserRo,
  UserLoginDTO,
  UserRegisterDTO,
  UserPaginateRo,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // 列出用户
  async listAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<UserPaginateRo> {
    const users = await this.userRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (page - 1),
    });
    return {
      data: users[0].map(user => user.toResponseObject()),
      pagination: {
        total: users[1],
      },
    };
  }

  // 查找某个用户
  async findOne(email: string): Promise<UserRo> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user.toResponseObject();
  }

  // 用户登录
  async login(data: UserLoginDTO): Promise<UserRo> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('无效的 用户名/密码', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject(true);
  }

  // 用户注册
  async register(data: UserRegisterDTO): Promise<UserRo> {
    const { email, username } = data;
    let user = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (user) {
      let msg: string = '';
      if (user.email === email) {
        msg = '该邮箱已存在';
      } else if (user.username === username) {
        msg = '该用户名已存在';
      }
      throw new HttpException(msg, HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
