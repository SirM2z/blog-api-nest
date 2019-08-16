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
import { ApiUseTags, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { HttpCache } from './core/decorators/cache.decorator';
import * as CACHE_KEY from './constants/cache.constant';
import * as APP_CONFIG from './app.config';

@ApiUseTags('app')
@Controller()
export class AppController {
  @Get()
  // @HttpCache(CACHE_KEY.INFO, 60 * 60)
  root() {
    return APP_CONFIG.INFO;
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true, description: 'img' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', APP_CONFIG.APP.UPLOAD_PATH),
        filename: (req, file, cb) => {
          const filename = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(
            null,
            `${filename}-${Date.now()}-${Math.round(
              Math.random() * 1000000,
            )}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file) {
    return {
      imgUrl: `http://localhost:${APP_CONFIG.APP.PORT}/${file.filename}`,
    };
  }

  // 改用静态文件目录代替
  @Get('file/:filepath')
  returnFile(@Param('filepath') file, @Res() res) {
    return res.sendFile(file, { root: APP_CONFIG.APP.UPLOAD_PATH });
  }
}
