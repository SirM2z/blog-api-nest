import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as appConfig from './app.config';
import { ApiModule } from './modules/api/api.module';
import { CorsMiddleware } from './middlewares/cors.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(appConfig.POSTGRESQL), ApiModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
