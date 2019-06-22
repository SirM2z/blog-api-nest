# Ryan's Blog Api

这里是我的个人博客 Ryan's Blog 站点的后端 Api。

基于 Nestjs 开发，使用 PostgreSQL 作为数据存储，提供 REST API 和 GraphQL 两种 Api。

## Features

- [x] Authenticate users
- [ ] Users can CRUD articles

## Stack

- Database - PostgreSQL
- REST API - NestJS
- GraphQL API - NestJS
- Rest & GraphQL Frontend - React with Ant-Design & Apollo Clientv

## 架构说明

- HTTP 状态码（详见 [errors](https://github.com/SirM2z/blog-api-nest/tree/master/src/core/exceptions) ）

  - `400` 请求的业务被拒绝
  - `401` 鉴权失败
  - `403` 权限不足/请求参数需要更高的权限
  - `404` 资源不存在
  - `405` 无此方法
  - `500` 服务器挂了
  - `200` 正常
  - `201` POST 正常

- 数据特征码（详见 [http.interface.ts](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/interfaces/http.interface.ts) ）
  - `status`：
    - `success`：正常
    - `error`：异常
  - `message`：永远返回（由 [http.decorator](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/decorators/http.decorator.ts) 装饰）
  - `error`：一般会返回错误发生节点的 error；在 `status` 为 `error` 的时候必须返回，方便调试
  - `debug`：开发模式下为发生错误的堆栈，生产模式不返回
  - `result`：在 `status` 为 `success` 的时候必须返回
    - 列表数据：一般返回`{ pagination: {...}, data: {..} }`
    - 具体数据：例如文章，则包含直接数据如`{ title: '', content: ... }`

## 应用结构

- 入口

  - `main.ts`：引入配置，启动主程序，引入各种全局服务
  - `app.module.ts`：主程序根模块，负责各业务模块的聚合
  - `app.controller.ts`：主程序根控制器
  - `app.config.ts`：主程序配置，数据库、程序、第三方，一切可配置项
  - `app.environment.ts：`全局环境变量

- 请求处理流程

  1. `request`：收到请求
  2. `middleware`：中间件过滤（跨域、来源校验等处理）
  3. `guard`：守卫过滤（鉴权）
  4. `interceptor:before`：数据流拦截器（本应用为空，即：无处理）
  5. `pipe`：参数提取（校验）器
  6. `controller`：业务控制器
  7. `service`：业务服务
  8. `interceptor:after`：数据流拦截器（格式化数据、错误）
  9. `filter`：捕获以上所有流程中出现的异常，如果任何一个环节抛出异常，则返回错误

- 鉴权处理流程

  1. `guard`：[守卫](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/guards/auth.guard.ts) 分析请求
  2. `guard.canActivate`：继承处理
  3. `guard.validateToken`：调用 [鉴权方法](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/guards/auth.guard.ts#L39)
  4. `guard`：[根据鉴权服务返回的结果作判断处理，通行或拦截](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/guards/auth.guard.ts#L32)

- 拦截器 [interceptors](https://github.com/SirM2z/blog-api-nest/tree/master/src/core/interceptors)

  - [数据流转换拦截器](https://github.com/SirM2z/blog-api-nest/tree/master/src/core/interceptors/transform.interceptor.ts)：当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构
  - [数据流异常拦截器](https://github.com/SirM2z/blog-api-nest/tree/master/src/core/interceptors/error.interceptor.ts)：当控制器所需的 Promise service 发生错误时，错误将在此被捕获
  - [日志拦截器](https://github.com/SirM2z/blog-api-nest/tree/master/src/core/interceptors/logging.interceptor.ts)：代替默认的全局日志

- 装饰器 [decorators](https://github.com/SirM2z/blog-api-nest/tree/master/src/core/decorators)

  - [缓存装饰器](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/decorators/cache.decorator.ts)：用于配置 `cache key / cache ttl`
  - [控制器响应装饰器](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/decorators/http.decorator.ts)：用于输出规范化的信息，如 `message` 和 翻页参数数据

- 守卫 [guards](https://github.com/SirM2z/blog-api-nest/tree/master/src/core/guards)

  - 默认所有请求会使用 [Auth](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/guards/auth.guard.ts) 守卫鉴权

- 管道 [pipes](https://github.com/SirM2z/blog-api-nest/tree/master/src/core/pipes)
  - 用于验证所有基于 class-validate 的验证类 [ValidationPipe](https://github.com/SirM2z/blog-api-nest/blob/master/src/core/pipes/validation.pipe.ts)

## 开发命令

### Installation

```bash
$ npm install
```

### Running the app

```bash
# 开发
$ npm run start:dev

# 构建
$ npm run build

# 调试
$ npm run start:debug

# 生产环境运行
$ npm run start:prod
```

### Test

```bash
# 语法检查
$ npm run lint

# 测试
$ npm run test
$ npm run test:watch
$ npm run test:cov
$ npm run test:debug
$ npm run test:e2e
```

## License

[MIT licensed](LICENSE).
