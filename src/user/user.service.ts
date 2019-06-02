import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserRo, UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async listAll(page: number = 1, pageSize: number = 10): Promise<UserRo[]> {
    const users = await this.userRepository.find({
      take: pageSize,
      skip: pageSize * (page - 1),
    });
    return users.map(user => user.toResponseObject());
  }

  async findOne(username: string): Promise<UserRo> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return user.toResponseObject();
  }

  async login(data: UserDTO): Promise<UserRo> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject(true);
  }

  async register(data: UserDTO): Promise<UserRo> {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User alerady exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
