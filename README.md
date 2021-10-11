<p align="center">
 <h1>This is an example of Nest, MySQL, Sequelize ORM, Swagger, Sentry</h1>
</p>
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
</br>**This is example of Nest, MySQL, Sequelize ORM, Swagger, Sentry**  

## Installation

```bash
$ npm i -g @nestjs/cli
$ nest new project-name

```

## Running the app

```bash
$ npm run start
```

## Create a new Nest app using the CLI

```bash
$ nest new app-name
```

## Install Swagger

```bash
$ npm install --save @nestjs/swagger swagger-ui-express
```
Once the installation process is complete, open the main.ts file and initialize Swagger using the SwaggerModule class:

### main.ts
```javascript
//swagger setup
 const config = new DocumentBuilder()
    .setTitle('Nest Rest API')
    .setDescription('The Nest Rest API. API description the crud operation for user models' )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
```


### app.controller.ts
To create a tag in the controller@ApiTags('Root Path')

```javascript
@Controller()
@ApiTags('Root Path')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('throw')
  throwError(): string {
    throw new HttpException({ message: 'Sample Error' }, 500);
  }
```

### user/user.model.ts
To create a schema in the model @  @ApiProperty()
```javascript
@Table
export class User extends Model {
  @Column
  @ApiProperty()
  name: string;
  @Column
  @ApiProperty()
  email: string;
  @Column
  @ApiProperty()
  password: string;
}
```
and then run the app and you will see.</br>

![swagger02](https://user-images.githubusercontent.com/29441880/136858370-d2b5f09d-fcbb-4c08-9a50-9780e3da9d59.PNG)

## Install Sequelize MySQL

```bash
$ npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
$ npm install --save-dev @types/sequelize
```
### Create Sentry module, service and interceptor
```bash
$ nest g module user
$ nest g service user
$ nest g model user
$ nest g controller user
```

## Install Sentry

```bash
$ npm install --save @sentry/node @sentry/tracing
```

## Create Sentry module, service and interceptor

```bash
$ nest g module sentry
$ nest g service sentry
$ nest g interceptor sentry/sentry
```

### SentryModule

1- Create the `SentryModule.forRoot()` method.
```javascript
static forRoot(options: Sentry.NodeOptions) {
    Sentry.init(options);
    return {
      module: SentryModule,
      providers: [
        {
          provide: SENTRY_OPTIONS,
          useValue: options,
        },
        SentryService,
        {
          provide: APP_INTERCEPTOR,
          useClass: SentryInterceptor,
        },
      ],
      exports: [SentryService],
    };

```
2- Call the `Sentry.Module.forRoot({...})` in the AppModule.
```javascript
 SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      tracesSampleRate: 1.0,
      debug: true,
    }),
```
3- Add the call to the Express requestHandler middleware in the `AppModule`.

```javascript
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(Sentry.Handlers.requestHandler())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
```

### SentryService

We want to initialize the transaction in the constructor of the service. You can
customize your main transaction there.

```javascript
@Injectable({ scope: Scope.REQUEST })
```

Note that because I inject the Express request, the service must be request scoped. You
can read more about that [here](https://docs.nestjs.com/fundamentals/injection-scopes#request-provider).

```javascript
@Injectable({ scope: Scope.REQUEST })
export class SentryService {
  constructor(@Inject(REQUEST) private request: Request) {
    // ... etc ...
  }
}
```

### SentryInterceptor

The `SentryInterceptor` will capture the exception and finish the transaction. Please also
note that it must be request scoped as we inject the `SentryService`:

```javascript
@Injectable({ scope: Scope.REQUEST })
export class SentryInterceptor implements NestInterceptor {
  constructor(private sentryService: SentryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // ... etc ...
  }
}
```


