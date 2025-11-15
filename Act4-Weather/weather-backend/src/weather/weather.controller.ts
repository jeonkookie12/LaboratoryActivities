import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

/**
 * Weather controller
 * Handles all HTTP requests related to weather data
 * All endpoints are prefixed with '/weather'
 */
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * GET /weather/history
   * Retrieves the recent search history from the database
   * @returns {Promise<any[]>} Array of recent weather searches
   */
  @Get('history')
  getHistory() {
    return this.weatherService.getSearchHistory();
  }

  /**
   * GET /weather?city=<city_name>
   * Retrieves current weather and 5-day forecast for a specified city
   * Fetches data from OpenWeatherMap API and saves search to database
   * @param {string} city - City name from query parameter
   * @returns {Promise<any>} Weather data including current conditions and forecast
   */
  @Get()
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather(city);
  }
}
