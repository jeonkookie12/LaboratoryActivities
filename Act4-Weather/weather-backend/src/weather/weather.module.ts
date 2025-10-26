import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { DatabaseService } from './database.service';

@Module({
  providers: [WeatherService, DatabaseService],
  controllers: [WeatherController],
})
export class WeatherModule {}
