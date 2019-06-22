/**
 * User controller.
 * @file 用户模块控制器
 * @module module/user/controller
 * @author Ryan <https://github.com/sirm2z>
 */

import { Controller, Get, UseGuards, Query, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { AuthGuard } from '../../core/guards/auth.guard';
import { HttpProcessor } from '../../core/decorators/http.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @HttpProcessor.paginate()
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
