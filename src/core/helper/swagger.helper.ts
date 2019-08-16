/**
 * Swagger helper.
 * @file Swagger 配置 具体参考 https://docs.nestjs.com/recipes/swagger
 * @module core/helper/swagger
 * @author Ryan <https://github.com/sirm2z>
 */

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../../app.module';
import { UserModule } from '../../modules/user/user.module';

export function SwaggerHelper(app) {
  const appOptions = new DocumentBuilder()
    .setTitle('App')
    .setVersion('1.0')
    .setSchemes('https')
    .setBasePath('//api.ryanc.tk')
    .addTag('app')
    .build();
  const appDocument = SwaggerModule.createDocument(app, appOptions, {
    include: [AppModule],
  });
  SwaggerModule.setup('api', app, appDocument);

  const userOptions = new DocumentBuilder()
    .setTitle('User')
    .setDescription('The user API')
    .setVersion('1.0')
    .setSchemes('https')
    .setBasePath('//api.ryanc.tk')
    .addTag('user')
    .build();
  const userDocument = SwaggerModule.createDocument(app, userOptions, {
    include: [UserModule],
  });
  SwaggerModule.setup('api/user', app, userDocument);
}
