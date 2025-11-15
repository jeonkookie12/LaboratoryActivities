import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

/**
 * Authentication service
 * Contains all business logic for authentication and authorization
 * Handles user registration, login, and JWT token generation
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user account
   * Hashes the password before storing it
   * @param {RegisterDto} registerDto - User registration data
   * @returns {Promise<User>} The newly created user
   * @throws {BadRequestException} If the username is already taken
   */
  async register(registerDto: RegisterDto): Promise<User> {
    const { username, password } = registerDto;
    const existingUser = await this.usersRepository.findOneBy({ username });
    if (existingUser) {
      throw new BadRequestException('Username already taken');
    }
    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  /**
   * Authenticates a user and returns a JWT access token
   * Validates username and password against stored credentials
   * @param {LoginDto} loginDto - User login credentials
   * @returns {Promise<{accessToken: string}>} JWT access token
   * @throws {UnauthorizedException} If credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;
    const user = await this.usersRepository.findOneBy({ username });
    // Compare provided password with hashed password in database
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Create JWT payload with username and user ID
    const payload = { username: user.username, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  /**
   * Finds a user by their ID
   * Used by JWT strategy to validate tokens
   * @param {string} id - The user ID
   * @returns {Promise<User | null>} The user if found, null otherwise
   */
  async findUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}