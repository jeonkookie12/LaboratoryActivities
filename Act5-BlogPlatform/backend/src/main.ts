import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the NestJS application
 * This is the entry point of the Blog Platform application
 */
async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  // Enable CORS (Cross-Origin Resource Sharing) to allow frontend requests
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Start the server on port 3000
  await app.listen(3000);
}
bootstrap();