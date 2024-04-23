import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://dev--product-log.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      skipMissingProperties: true,
      transform: true,
    }),
  );

  const logger = new Logger('Main');

  await app.listen(5000);

  logger.log(`Server is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Main');
  logger.error('Application failed to start!', error);
});
