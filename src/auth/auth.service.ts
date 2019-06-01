import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { sign } from 'jsonwebtoken';
import { UserService } from '../shared/user.service';
import { Payload } from '../interfaces/payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  signPayload(payload: Payload) {
    // const token = sign(payload, process.env.SECRET_KEY, { expiresIn: '12h' });
    const token = this.jwtService.sign(payload);
    return token;
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }
}
