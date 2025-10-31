import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
    });
  }

  /**
   * Ověř JWT token a vrať uživatele
   * Passport automaticky volá tuto metodu
   */
  async validate(payload: any) {
    // payload obsahuje { sub, email, role }
    const user = await this.authService.validateUser(payload.sub);
    return user;
  }
}

