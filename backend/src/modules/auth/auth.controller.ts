import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registrace nového uživatele
   * POST /auth/register
   * Body: { email, password, name? }
   */
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name?: string,
  ) {
    // TODO: Přidat DTO a validaci
    return this.authService.register(email, password, name);
  }

  /**
   * Login uživatele
   * POST /auth/login
   * Body: { email, password }
   */
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    // TODO: Přidat DTO a validaci
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

  // TODO: Přidat logout endpoint (invalidace tokenu)
  // TODO: Přidat refresh token endpoint
  // TODO: Přidat forgot password endpoint
}

