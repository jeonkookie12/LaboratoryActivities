import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

/**
 * JWT Strategy
 * Implements Passport JWT strategy for token validation
 * Extracts and validates JWT tokens from Authorization header
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // Extract JWT token from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Do not ignore token expiration
      ignoreExpiration: false,
      // Use JWT secret from environment variables
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates the JWT payload and returns user information
   * Called after JWT token is successfully decoded
   * @param {any} payload - Decoded JWT payload
   * @returns {Promise<{id: string, username: string} | null>} User information or null
   */
  async validate(payload: any) {
    const user = await this.authService.findUserById(payload.sub);
    return user ? { id: user.id, username: user.username } : null;
  }
}