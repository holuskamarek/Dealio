import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }


  async validate(payload: any) {
    // payload obsahuje { sub, email, role }
    const user = await this.authService.validateUser(payload.sub);
    return user;
  }
}

