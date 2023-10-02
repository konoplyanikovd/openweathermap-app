import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5000'],
    allowedHeaders: 'Content-Type, Accept, Authorization',
    methods: 'GET,PUT,POST,DELETE',
  });
  await app.listen(3000);
}
bootstrap();
