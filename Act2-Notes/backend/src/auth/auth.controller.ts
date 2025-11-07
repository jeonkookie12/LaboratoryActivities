// src/auth/auth.controller.ts
import { Controller, Post, Body, UsePipes, ValidationPipe, Req, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SetPrivatePasswordDto } from './dto/set-private-password.dto';
import { ValidatePrivatePasswordDto } from './dto/validate-private-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

interface JwtRequest extends Request {
  user: { sub: number; email: string };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('set-private-password')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async setPrivatePassword(@Req() req: JwtRequest, @Body() dto: SetPrivatePasswordDto) {
    return this.authService.setPrivatePassword(req.user.sub, dto);
  }

  @Post('validate-private-password')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async validatePrivatePassword(@Req() req: JwtRequest, @Body() dto: ValidatePrivatePasswordDto) {
    return this.authService.validatePrivatePassword(req.user.sub, dto);
  }
}