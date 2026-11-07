import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Diplomado')
    .setDescription('Framework Nestjs')
    .setVersion('0.0.1')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Obtén el token en POST /api/v1/auth/login y pégalo aquí.',
    })
    .build();

  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentacion', app, documento);

  // await app.listen(process.env.PORT ?? 3000,'0.0.0.0');
  // logger.log(`La aplicación está corriendo en: ${await app.getUrl()}`);

  // Cambia esto:
  // await app.listen(process.env.PORT ?? 3000,'0.0.0.0');

  // Por esto (asegura el puerto 3000 o usa el del entorno pero forzando '0.0.0.0'):
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port, '0.0.0.0');
  
  logger.log(`La aplicación está corriendo en: ${await app.getUrl()}`);
}
bootstrap();
