import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Injectable()
export class WeatherService {
  constructor(
    private configService: ConfigService,
    private db: DatabaseService,
  ) {}

  async getWeather(city: string) {
    if (!city) return { error: 'City is required.' };

    const apiKey = this.configService.get('OPENWEATHER_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city,
    )}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) return { error: data.message || 'City not found.' };

    // Save search
    await this.db.addSearch(city);

    // Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city,
    )}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    const dailyForecasts = forecastData.list
      .filter((_, i) => i % 8 === 0)
      .slice(0, 5)
      .map((f: any) => ({
        date: f.dt_txt,
        temp: f.main.temp,
        description: f.weather[0].description,
      }));

    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      forecast: dailyForecasts,
    };
  }

  async getSearchHistory() {
    return this.db.getRecentSearches();
  }
}
