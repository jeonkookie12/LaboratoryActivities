import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SetPrivatePasswordDto } from './dto/set-private-password.dto';
import { ValidatePrivatePasswordDto } from './dto/validate-private-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const user = await this.usersService.create(registerDto);
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async setPrivatePassword(
    userId: number,
    dto: SetPrivatePasswordDto,
  ): Promise<{ message: string }> {
    if (dto.password !== dto.confirm) {
      throw new BadRequestException('Passwords do not match');
    }
    const hash = await bcrypt.hash(dto.password, 10);

    await this.usersService.update(userId, { private_password_hash: hash });

    return { message: 'Private password set' };
  }

  async validatePrivatePassword(
    userId: number,
    dto: ValidatePrivatePasswordDto,
  ): Promise<{ valid: boolean; message?: string }> {
    const user = await this.usersService.findOne(userId);

    if (!user.private_password_hash) {
      return { valid: false, message: 'No private password set' };
    }

    const match = await bcrypt.compare(dto.password, user.private_password_hash);
    return { valid: match };
  }
}