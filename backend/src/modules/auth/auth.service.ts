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
   * TODO: Přidat rate limiting
   */
  async register(email: string, password: string, name?: string) {
    // Validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new BadRequestException('Neplatný formát emailu');
    }

    // Zkontroluj, jestli uživatel už existuje
    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Uživatel s tímto emailem již existuje');
    }

    // Validace hesla - minimálně 8 znaků, alespoň 1 číslo, 1 velké a 1 malé písmeno
    if (!password || password.length < 8) {
      throw new BadRequestException('Heslo musí mít alespoň 8 znaků');
    }

    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Heslo musí obsahovat alespoň jedno velké písmeno');
    }

    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Heslo musí obsahovat alespoň jedno malé písmeno');
    }

    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Heslo musí obsahovat alespoň jednu číslici');
    }

    // Zahashuj heslo
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalizuj email na lowercase
    const normalizedEmail = email.toLowerCase();

    // Vytvoř nového uživatele
    const user = this.userRepository.create({
      email: normalizedEmail,
      password_hash: hashedPassword,
      name: name || normalizedEmail.split('@')[0], // Výchozí jméno z emailu
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
    // Normalizuj email na lowercase
    const normalizedEmail = email.toLowerCase();

    // Najdi uživatele
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
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

