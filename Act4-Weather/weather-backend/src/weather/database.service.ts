import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

/**
 * Database service
 * Manages MySQL database connection and operations for weather search history
 * Implements OnModuleInit to initialize database connection and create table on startup
 */
@Injectable()
export class DatabaseService implements OnModuleInit {
  private connection: mysql.Connection;

  /**
   * Initializes database connection and creates search_history table if it doesn't exist
   * Called automatically when the module is initialized
   */
  async onModuleInit() {
    // Create MySQL connection
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root', // or your DB user
      password: '', // your MySQL password
      database: 'weather_db',
    });

    // Create search_history table if it doesn't exist
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        city VARCHAR(255) NOT NULL,
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  /**
   * Adds a city search to the database history
   * @param {string} city - City name that was searched
   * @returns {Promise<void>} Promise that resolves when the search is saved
   */
  async addSearch(city: string) {
    await this.connection.execute(
      `INSERT INTO search_history (city) VALUES (?)`,
      [city],
    );
  }

  /**
   * Retrieves recent weather searches from the database
   * @param {number} limit - Maximum number of searches to retrieve (default: 5)
   * @returns {Promise<any[]>} Array of recent searches ordered by most recent first
   */
  async getRecentSearches(limit = 5) {
    const [rows] = await this.connection.execute(
      `SELECT city, searched_at FROM search_history ORDER BY searched_at DESC LIMIT ?`,
      [limit],
    );
    return rows;
  }
}
