import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Business, Promotion, Event } from '../entities';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async seed() {
    // Zkontroluj, jestli už jsou data v DB
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      console.log('✅ Data už existují v databázi, seed přeskočen');
      return;
    }

    console.log('Spouštím seed...');

    // Vytvoř testovací uživatele
    const user1 = await this.createUser(
      'customer@example.com',
      'password123',
      'Jan Novák',
      'user',
    );

    const user2 = await this.createUser(
      'owner@example.com',
      'password123',
      'Petr Svoboda',
      'business_owner',
    );

    // TODO: Vytvořit admin uživatele

    console.log('Uživatelé vytvořeni');

    // Vytvoř testovací podniky
    const business1 = await this.businessRepository.save({
      name: 'Kavárna U Medvěda',
      address: 'Hlavní 123, Praha 1',
      type: 'kavárna',
      owner_id: user2.id,
      phone: '+420 123 456 789',
      website: 'https://kavarna-medveda.cz',
      description: 'Gemütliche Kaffeestube mit hausgemachten Kuchen',
      opening_hours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '20:00' },
        saturday: { open: '09:00', close: '20:00' },
        sunday: { open: '10:00', close: '18:00' },
      },
    });

    const business2 = await this.businessRepository.save({
      name: 'Bistro Srdce',
      address: 'Nerudova 456, Praha 1',
      type: 'bistro',
      owner_id: user2.id,
      phone: '+420 987 654 321',
      website: 'https://bistro-srdce.cz',
      description: 'Tradiční česká kuchyně v příjemném prostředí',
      opening_hours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '12:00', close: '22:00' },
      },
    });

    console.log(' Podniky vytvořeny');

    // Vytvoř testovací akce
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const promotion1 = await this.promotionRepository.save({
      business_id: business1.id,
      title: 'Káva 1+1 zdarma',
      description: 'Koupi si jednu kávu, druhou dostaneš zdarma!',
      discount_percent: 50,
      start_datetime: now,
      end_datetime: tomorrow,
      target_hours: ['14:00-16:00'],
      limit: 20,
      is_active: true,
    });

    const promotion2 = await this.promotionRepository.save({
      business_id: business2.id,
      title: 'Sleva 30% na obědy',
      description: 'Všechny obědy se slevou 30% v čase 11:00-14:00',
      discount_percent: 30,
      start_datetime: now,
      end_datetime: nextWeek,
      target_hours: ['11:00-14:00'],
      limit: 50,
      is_active: true,
    });

    console.log(' Akce vytvořeny');

    // Vytvoř testovací eventy (analytika)
    await this.eventRepository.save({
      promotion_id: promotion1.id,
      user_id: user1.id,
      type: 'view',
      metadata: { device: 'mobile', os: 'iOS' },
    });

    await this.eventRepository.save({
      promotion_id: promotion1.id,
      user_id: user1.id,
      type: 'click',
      metadata: { button: 'details' },
    });

    await this.eventRepository.save({
      promotion_id: promotion1.id,
      user_id: user1.id,
      type: 'follow',
      metadata: {},
    });

    await this.eventRepository.save({
      promotion_id: promotion2.id,
      user_id: null, // Anonymní event
      type: 'view',
      metadata: { device: 'web', browser: 'Chrome' },
    });

    console.log(' Eventy vytvořeny');

    console.log(' Seed úspěšně dokončen!');
  }

  private async createUser(
    email: string,
    password: string,
    name: string,
    role: 'user' | 'business_owner' | 'admin',
  ): Promise<User> {
    // TODO: Implementovat bcrypt pro hashování hesla
    // Teď používáme plain text - POUZE PRO VÝVOJ!
    const user = await this.userRepository.save({
      email,
      password_hash: password, // FIXME: Toto by mělo být hashované!
      name,
      role,
    });
    return user;
  }
}

