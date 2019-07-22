/**
 * User service.
 * @file 用户模块服务
 * @module module/user/service
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  Injectable,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import {
  UserRo,
  UserLoginDTO,
  UserRegisterDTO,
  UserPaginateRo,
  OrderString,
} from './user.dto';
import * as APP_CONFIG from '../../app.config';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // 初始化管理员账号
  async onModuleInit(): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [
        { email: APP_CONFIG.ADMIN_USER.email },
        { username: APP_CONFIG.ADMIN_USER.username },
      ],
    });
    if (!user) {
      const admin = await this.userRepository.create({
        email: APP_CONFIG.ADMIN_USER.email,
        username: APP_CONFIG.ADMIN_USER.username,
        password: APP_CONFIG.ADMIN_USER.password,
        roles: APP_CONFIG.ADMIN_USER.roles,
      });
      await this.userRepository.save(admin);
    }
  }

  // 列出用户
  async listAll(
    page: number,
    pageSize: number,
    order: OrderString,
    orderBy: string,
    search: string,
  ): Promise<UserPaginateRo> {
    const orderValue = {};
    if (orderBy) {
      orderValue[orderBy] = order;
    }
    const users = await this.userRepository
      .createQueryBuilder()
      .where('username like :name', { name: `%${search}%` })
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .orderBy(orderBy, order)
      .getManyAndCount();
    return {
      data: users[0].map(user => user.toResponseObject()),
      total: users[1],
      currentPage: page,
      totalPage: Math.ceil(users[1] / pageSize),
      perPage: pageSize,
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
      if (user.username === username) {
        msg = '该用户名已存在';
      } else if (user.email === email) {
        msg = '该邮箱已存在';
      }
      throw new HttpException(msg, HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
