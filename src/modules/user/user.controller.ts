import { Controller, Get, UseGuards, Query, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../shared/auth.guard';
import { UserDTO } from './user.dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @UseGuards(new AuthGuard())
  showAllUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.userService.listAll(page, pageSize);
  }

  @Post('login')
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
