import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

/**
 * Root application module
 * Configures the main application dependencies and database connection
 */
@Module({
  imports: [
    // Configure TypeORM database connection to MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'activity',
      autoLoadEntities: true, // Automatically load entity files
    }),
    // Import the Tasks module to enable task-related functionality
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
