import { Injectable } from '@nestjs/common';

/**
 * Root application service
 * Provides basic application-level business logic
 */
@Injectable()
export class AppService {
  /**
   * Returns a status message indicating the server is running
   * @returns {string} Status message
   */
  getUpdate(): string {
    return 'Weather API Server is running successfully.';
  }
}
