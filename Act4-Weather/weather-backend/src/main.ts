import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the NestJS application
 * This is the entry point of the Weather application
 */
async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS (Cross-Origin Resource Sharing) to allow frontend requests
  // Allows requests from multiple frontend origins
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
  });

  // Start the server on port 3000
  await app.listen(3000);
  console.log('✅ Backend running on http://localhost:3000');
}
bootstrap();
