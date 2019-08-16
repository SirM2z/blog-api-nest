/**
 * User controller.
 * @file 用户模块控制器
 * @module module/user/controller
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  Controller,
  Get,
  UseGuards,
  Query,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiImplicitBody,
  ApiImplicitQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  UserLoginDTO,
  UserRegisterDTO,
  UserUpdateDTO,
  OrderString,
} from './user.dto';
import { AuthGuard } from '../../core/guards/auth.guard';
import { HttpProcessor } from '../../core/decorators/http.decorator';
import { User } from '../../core/decorators/user.decorator';

@ApiUseTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpProcessor.paginate()
  @UseGuards(new AuthGuard())
  @ApiBearerAuth()
  @ApiImplicitQuery({ name: 'order', type: 'string', enum: ['ASC', 'DESC'] })
  showAllUsers(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('order') order: OrderString,
    @Query('orderBy') orderBy: string = '',
    @Query('search') search: string = '',
  ) {
    return this.userService.listAll(page, pageSize, order, orderBy, search);
  }

  @Post('login')
  login(@Body() data: UserLoginDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  register(@Body() data: UserRegisterDTO) {
    return this.userService.register(data);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @ApiBearerAuth()
  @ApiImplicitBody({
    name: 'data',
    type: UserUpdateDTO,
    description: '二选一提交即可',
  })
  update(
    @Param('id') id: string,
    @User('id') user: string,
    @Body() data: Partial<UserUpdateDTO>,
  ) {
    return this.userService.update(id, user, data);
  }
}
