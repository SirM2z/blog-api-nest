/**
 * App controller.
 * @file 主页控制器
 * @module app/controller
 * @author Ryan <https://github.com/sirm2z>
 */

import {
  Controller,
  Get,
  UseInterceptors,
  UploadedFile,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpCache } from './core/decorators/cache.decorator';
import * as CACHE_KEY from './constants/cache.constant';
import * as APP_CONFIG from './app.config';

@Controller()
export class AppController {
  @Get()
  // @HttpCache(CACHE_KEY.INFO, 60 * 60)
  root() {
    return APP_CONFIG.INFO;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return {
      imgUrl: `http://localhost:${APP_CONFIG.APP.PORT}/file/${file.filename}`,
    };
  }

  @Get('file/:filepath')
  returnFile(@Param('filepath') file, @Res() res) {
    return res.sendFile(file, { root: APP_CONFIG.APP.UPLOAD_PATH });
  }
}
