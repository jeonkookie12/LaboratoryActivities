import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

/**
 * Interface for daily forecast data
 * Represents weather forecast for a single day
 */
export interface DailyForecast {
  /** Date of the forecast */
  date: string;
  /** Temperature in Celsius */
  temp: number;
  /** Weather description */
  description: string;
}

/**
 * Weather service
 * Contains all business logic for weather data operations
 * Integrates with OpenWeatherMap API and manages search history
 */
@Injectable()
export class WeatherService {
  constructor(
    private configService: ConfigService,
    private db: DatabaseService,
  ) {}

  /**
   * Retrieves current weather and 5-day forecast for a specified city
   * Fetches data from OpenWeatherMap API and saves search to database
   * @param {string} city - City name to get weather for
   * @returns {Promise<any>} Weather data including current conditions and forecast
   */
  async getWeather(city: string) {
    if (!city) return { error: 'City is required.' };

    const apiKey = this.configService.get('OPENWEATHER_API_KEY');
    const encodedCity = encodeURIComponent(city);

    // === Fetch current weather ===
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric`;
    const currentRes = await fetch(currentUrl);
    const currentData = await currentRes.json();

    if (currentData.cod !== 200) {
      return { error: currentData.message || 'City not found.' };
    }

    // Save search to database for history tracking
    await this.db.addSearch(city);

    // === Fetch 5-day forecast ===
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${apiKey}&units=metric`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    if (forecastData.cod !== '200') {
      return { error: forecastData.message || 'Forecast not available.' };
    }

    // === Process and group forecast data ===
    // Extract one forecast per day (5 days total)
    const seenDates = new Set<string>();
    const dailyForecasts: DailyForecast[] = [];

    for (const entry of forecastData.list) {
      const dateOnly = entry.dt_txt.split(' ')[0];
      if (!seenDates.has(dateOnly)) {
        seenDates.add(dateOnly);
        dailyForecasts.push({
          date: entry.dt_txt,
          temp: entry.main.temp,
          description: entry.weather[0].description,
        });
      }
      if (dailyForecasts.length === 5) break;
    }

    // === Replace today's forecast (index 0) with the current live data ===
    if (dailyForecasts.length > 0) {
      dailyForecasts[0] = {
        date: new Date().toISOString().split('T')[0],
        temp: currentData.main.temp,
        description: currentData.weather[0].description,
      };
    }

    // === Return structured response ===
    return {
      city: currentData.name,
      current: {
        temperature: currentData.main?.temp ?? 0,
        description: currentData.weather?.[0]?.description ?? 'N/A',
        feels_like: currentData.main?.feels_like ?? 0,
        humidity: currentData.main?.humidity ?? 0,
        wind_speed: currentData.wind?.speed ?? 0,
      },
      forecast: dailyForecasts,
    };
  }

  /**
   * Retrieves the recent search history from the database
   * @returns {Promise<any[]>} Array of recent weather searches
   */
  async getSearchHistory() {
    return this.db.getRecentSearches();
  }
}
