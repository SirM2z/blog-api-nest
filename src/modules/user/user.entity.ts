/**
 * User entity.
 * @file 用户模块实体
 * @module module/user/entity
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import * as APP_CONFIG from '../../app.config';

@Entity('user_tbl')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @Column({
    type: 'text',
    default: '',
  })
  roles: string;

  private get token() {
    const { id, username, roles } = this;
    return sign({ id, username, roles }, APP_CONFIG.AUTH.jwtTokenSecret, {
      expiresIn: APP_CONFIG.AUTH.expiresIn,
    });
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = false) {
    const { id, created, username, roles, token } = this;
    const responseObject: any = { id, created, username, roles };
    if (showToken) {
      responseObject.token = token;
    }
    return responseObject;
  }
}
