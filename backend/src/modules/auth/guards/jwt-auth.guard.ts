import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Auth Guard
 * Používá se k ochraně endpointů, které vyžadují autentizaci
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

