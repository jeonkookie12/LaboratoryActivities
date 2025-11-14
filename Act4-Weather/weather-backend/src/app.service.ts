import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getUpdate(): string {
    return 'Weather API Server is running successfully.';
  }
}
