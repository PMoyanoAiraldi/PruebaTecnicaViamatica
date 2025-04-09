import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true,skipMissingProperties: true, transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Prueba Tecnica Viamatica")
    .setDescription("Esta aplicación crear, buscar, modificar y eliminar usuarios, roles, sesiones")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);
  
  await app.listen(3010);
}

bootstrap();
