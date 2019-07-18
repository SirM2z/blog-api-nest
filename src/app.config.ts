/**
 * App config
 * @file 应用运行配置
 * @module app/config
 * @author Ryan <https://github.com/sirm2z>
 */

import { ConnectionOptions } from 'typeorm';
import { environment } from './app.environment';
import { packageJson } from './shared/module.transform';

export const APP = {
  PORT: process.env.PORT || 5000,
  ROOT_PATH: __dirname,
  NAME: 'Ryan',
  URL: 'https://www.ryanc.top',
  ENVIRONMENT: environment,
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
};

export const ADMIN_USER = {
  username: 'Ryan',
  email: 'ryan@ryanc.top',
  password: 'password',
  roles: 'admin',
};

export const CROSS_DOMAIN = {
  allowedOrigins: ['http://localhost:3000', 'https://www.ryanc.top'],
  allowedHeaders: [
    'Authorization',
    'Origin',
    'No-Cache',
    'X-Requested-With',
    'If-Modified-Since',
    'Pragma',
    'Last-Modified',
    'Cache-Control',
    'Expires',
    'Content-Type',
    'X-E4M-With',
  ],
  maxAge: 20 * 24 * 60 * 60,
};

export const POSTGRESQL: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.PSQL_HOST || 'localhost',
  port: 5432,
  username: process.env.PSQL_USERNAME || 'postgres',
  password: process.env.PSQL_PASSWORD || '',
  database: process.env.PSQL_NAME || 'nestjs',
  synchronize: true,
  dropSchema: false,
  logging: true,
  entities: [__dirname + '/**/*.entity{.js,.ts}'],
};

export const AUTH = {
  expiresIn: process.env.JWT_EXPIRESIN || '12h',
  jwtTokenSecret: process.env.SECRET_KEY || 'SECRET_KEY',
};

export const GITHUB = {
  username: 'sirm2z',
};

export const INFO = {
  name: packageJson.name,
  version: packageJson.version,
  author: packageJson.author,
  site: APP.URL,
  github: 'https://github.com/SirM2z/blog-api-nest',
  homepage: packageJson.homepage,
  issues: packageJson.bugs.url,
  powered: ['React', 'Ant-design', 'NestJS', 'Nodejs', 'PostgreSQL', 'Nginx'],
};
