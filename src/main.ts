// import './sentry/instrument';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded } from 'body-parser';
import express, { json } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import useSwaggerUIAuthStoragePlugin from './swagger_plugin';
import { CustomValidationException } from './core/error';
// import { LoggerService } from '@app/logger';
// import { ClusterIoAdapter } from './socket/cluster.io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: new LoggerService(),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (validationErrors) => {
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        const errors: Record<string, string> | any = {};
        validationErrors.forEach((err: any) => {
          errors[err.property] = Object.values(err.constraints).join(`\n`);
        });
        return new CustomValidationException(errors);
      },
    }),
  );

  app.setGlobalPrefix('/');

  const options = new DocumentBuilder()
    .setTitle('NOGICJQS API DOCUMENTATION')
    .setDescription('API endpoints for NOGICJQS portal')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      plugins: [useSwaggerUIAuthStoragePlugin()],
    },
  });

  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));
  app.use(express.static(join(process.cwd(), 'public')));

  app.set('trust proxy', true);

  // Only use ClusterIoAdapter if running in a clustered environment
  // if (process.env.CLUSTER_MODE === 'true') {
  //   app.useWebSocketAdapter(new ClusterIoAdapter(app));
  // } else {
  //   console.log('Skipping ClusterIoAdapter: Running in single process');
  // }

  app.setBaseViewsDir(join(__dirname, '../..', 'views'));
  app.setViewEngine('ejs');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap();
