import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { User } from '../entities/user.entity';

/**
 * Authentication controller
 * Handles all HTTP requests related to authentication and authorization
 * All endpoints are prefixed with '/auth'
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register
   * Registers a new user account
   * @param {RegisterDto} registerDto - User registration data
   * @returns {Promise<User>} The newly created user
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * POST /auth/login
   * Authenticates a user and returns a JWT token
   * @param {LoginDto} loginDto - User login credentials
   * @returns {Promise<{accessToken: string}>} JWT access token
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * GET /auth/profile
   * Retrieves the authenticated user's profile information
   * Requires JWT authentication
   * @param {User} user - Authenticated user from JWT token
   * @returns {{id: string, username: string}} User profile information
   */
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return { id: user.id, username: user.username };
  }

}