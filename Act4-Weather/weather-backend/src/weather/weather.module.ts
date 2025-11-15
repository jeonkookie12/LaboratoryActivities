import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { DatabaseService } from './database.service';

/**
 * Weather module
 * Configures the weather feature module with its dependencies
 */
@Module({
  // Register WeatherService and DatabaseService as providers
  providers: [WeatherService, DatabaseService],
  // Register the WeatherController to handle HTTP requests
  controllers: [WeatherController],
})
export class WeatherModule {}
