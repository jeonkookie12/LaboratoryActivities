import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Authentication module
 * Configures the authentication feature module with JWT support
 * Exports AuthService for use in other modules
 */
@Module({
  imports: [
    // Register User entity with TypeORM for this module
    TypeOrmModule.forFeature([User]),
    // Import PassportModule for authentication strategies
    PassportModule,
    // Configure JWT module asynchronously using environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), // JWT secret key from environment
        signOptions: { expiresIn: '60m' }, // Token expires in 60 minutes
      }),
    }),
  ],
  // Register the AuthController to handle HTTP requests
  controllers: [AuthController],
  // Register AuthService and JwtStrategy as providers
  providers: [AuthService, JwtStrategy],
  // Export AuthService so other modules can use it
  exports: [AuthService],
})
export class AuthModule {}
