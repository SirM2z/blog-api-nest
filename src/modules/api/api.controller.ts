import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiService } from './api.service';
import * as appConfig from '../../app.config';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Get()
  getHello() {
    return this.apiService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return {
      imgUrl: `http://localhost:${appConfig.APP.PORT}/api/file/${
        file.filename
      }`,
    };
  }

  @Get('file/:filepath')
  returnFile(@Param('filepath') file, @Res() res) {
    return res.sendFile(file, { root: appConfig.APP.UPLOAD_PATH });
  }
}
