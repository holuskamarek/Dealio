import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registrace nového uživatele
   * TODO: Přidat email validaci (regex)
   * TODO: Přidat rate limiting
   */
  async register(email: string, password: string, name?: string) {
    // Zkontroluj, jestli uživatel už existuje
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Uživatel s tímto emailem již existuje');
    }

    // FIXME: Heslo by mělo být validováno (minimální délka, složitost)
    if (!password || password.length < 6) {
      throw new BadRequestException('Heslo musí mít alespoň 6 znaků');
    }

    // Zahashuj heslo
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vytvoř nového uživatele
    const user = this.userRepository.create({
      email,
      password_hash: hashedPassword,
      name: name || email.split('@')[0], // Výchozí jméno z emailu
      role: 'user', // Výchozí role
    });

    await this.userRepository.save(user);

    // Vrať JWT token
    return this.generateToken(user);
  }

  /**
   * Login uživatele
   * TODO: Přidat rate limiting pro ochranu proti brute force útokům
   */
  async login(email: string, password: string) {
    // Najdi uživatele
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Nesprávný email nebo heslo');
    }

    // Ověř heslo
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Nesprávný email nebo heslo');
    }

    // Vrať JWT token
    return this.generateToken(user);
  }

  /**
   * Generuj JWT token
   * NOTE: Token obsahuje user ID a email
   */
  private generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Přihlášení úspěšné',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Ověř JWT token a vrať uživatele
   * Používá se v JWT strategie
   */
  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Uživatel nenalezen');
    }

    return user;
  }
}

