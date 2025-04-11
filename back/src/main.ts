import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true,skipMissingProperties: true, transform: true }));

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174'; 
  console.log({ frontendUrl });

  app.enableCors({
    origin: frontendUrl,  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  
    allowedHeaders: 'Authorization,Content-Type, Accept',
    maxAge: 3600,
  });


  const swaggerConfig = new DocumentBuilder()
    .setTitle("Prueba Tecnica Viamatica")
    .setDescription("Esta aplicación crear, buscar, modificar y eliminar usuarios, roles, sesiones")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);
  
  await app.listen(3010);
}

bootstrap();
