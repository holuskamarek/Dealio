import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registrace nového uživatele
   * POST /auth/register
   * Body: { email, password, name? }
   * Rate limit: 5 pokusů za minutu (ochrana proti spamu)
   */
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 registrací za minutu
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name?: string,
  ) {
    return this.authService.register(email, password, name);
  }

  /**
   * Login uživatele
   * POST /auth/login
   * Body: { email, password }
   * Rate limit: 5 pokusů za minutu (ochrana proti brute-force)
   */
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 loginů za minutu
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  /**
   * Ověř, že jsi přihlášený
   * GET /auth/me
   * Vyžaduje JWT token v Authorization headeru
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return {
      success: true,
      user: req.user,
    };
  }

}

