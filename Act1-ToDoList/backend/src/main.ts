import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS (Cross-Origin Resource Sharing) to allow frontend requests
  // This allows the frontend running on localhost:5173 to communicate with the backend
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Start the server on the specified port (default: 3000)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
