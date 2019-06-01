import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from './auth.dto';
import { Payload } from '../interfaces/payload';

@Controller('api/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() userDto: RegisterDTO) {
    const user = await this.userService.create(userDto);
    const payload: Payload = {
      username: user.username,
      roles: user.roles,
    };
    const token = this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('login')
  async login(@Body() userDto: LoginDTO) {
    const user = await this.userService.findByLogin(userDto);
    const payload: Payload = {
      username: user.username,
      roles: user.roles,
    };
    const token = this.authService.signPayload(payload);
    return { user, token };
  }
}
