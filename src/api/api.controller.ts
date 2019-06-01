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
import { ApiService } from './api.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Get()
  getHello() {
    return this.apiService.getHello();
  }

  @Post('upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return {
      imgUrl: `http://localhost:${process.env.PORT}/api/file/${file.filename}`,
    };
  }

  @Get('file/:filepath')
  returnFile(@Param('filepath') file, @Res() res) {
    return res.sendFile(file, { root: process.env.UPLOAD_PATH });
  }
}
