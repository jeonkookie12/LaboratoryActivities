import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule } from '@nestjs/config';

/**
 * Root application module
 * Configures the main application dependencies
 */
@Module({
  // Configure global ConfigModule to access environment variables (e.g., API keys)
  imports: [ConfigModule.forRoot({ isGlobal: true }), WeatherModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
