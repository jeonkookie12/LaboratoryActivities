import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private connection: mysql.Connection;

  async onModuleInit() {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root', // or your DB user
      password: '', // your MySQL password
      database: 'weather_db',
    });

    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        city VARCHAR(255) NOT NULL,
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async addSearch(city: string) {
    await this.connection.execute(
      `INSERT INTO search_history (city) VALUES (?)`,
      [city],
    );
  }

  async getRecentSearches(limit = 5) {
    const [rows] = await this.connection.execute(
      `SELECT city, searched_at FROM search_history ORDER BY searched_at DESC LIMIT ?`,
      [limit],
    );
    return rows;
  }
}
