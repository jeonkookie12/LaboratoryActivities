import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allow both 5173 and 5174 (in case Vite changes port)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
  });

  await app.listen(3000);
  console.log('✅ Backend running on http://localhost:3000');
}
bootstrap();
