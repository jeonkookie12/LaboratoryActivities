import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

/**
 * Root application module
 * Configures the main application dependencies, database connection, and feature modules
 */
@Module({
  imports: [
    // Configure global ConfigModule to access environment variables
    ConfigModule.forRoot({ isGlobal: true }),
    // Configure TypeORM database connection asynchronously using environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        // Automatically load all entity files
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    // Import feature modules
    TasksModule,    // Task management functionality
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
