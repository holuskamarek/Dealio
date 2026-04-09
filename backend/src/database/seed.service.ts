import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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
    console.log('Spouštím seed...');

    // Najdi nebo vytvoř vlastníka podniků
    let owner = await this.userRepository.findOne({
      where: { email: 'owner@example.com' },
    });

    if (owner) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      owner.password_hash = hashedPassword;
      owner.role = 'business_owner';
      await this.userRepository.save(owner);
      console.log('Heslo ownera aktualizováno na hash');
    } else {
      owner = await this.createUser(
        'owner@example.com',
        'password123',
        'Petr Čmelák',
        'business_owner',
      );
    }

    console.log(`Vlastník: ${owner.name} (${owner.email})`);

    // Zkontroluj jestli už jsou podniky
    const businessCount = await this.businessRepository.count();
    if (businessCount > 0) {
      console.log('Podniky už existují, přeskakuji...');
      console.log('Seed dokončen');
      return;
    }

    // === PODNIKY ===
    const kavarna = await this.businessRepository.save({
      name: 'Kavárna u Čmelina',
      address: 'Nádražní 12, Brno',
      type: 'kavarna',
      owner_id: owner.id,
      phone: '+420 555 111 222',
      website: 'https://kavarna-cmelin.cz',
      description: 'Útulná kavárna s domácími dezerty a výběrovou kávou',
      opening_hours: {
        monday: { open: '07:00', close: '19:00' },
        tuesday: { open: '07:00', close: '19:00' },
        wednesday: { open: '07:00', close: '19:00' },
        thursday: { open: '07:00', close: '19:00' },
        friday: { open: '07:00', close: '21:00' },
        saturday: { open: '08:00', close: '21:00' },
        sunday: { open: '09:00', close: '18:00' },
      },
    });

    const bufet = await this.businessRepository.save({
      name: 'Bufet u Čmelina',
      address: 'Masarykova 34, Brno',
      type: 'bistro',
      owner_id: owner.id,
      phone: '+420 555 333 444',
      description: 'Rychlé a chutné obědy za skvělé ceny',
      opening_hours: {
        monday: { open: '10:00', close: '15:00' },
        tuesday: { open: '10:00', close: '15:00' },
        wednesday: { open: '10:00', close: '15:00' },
        thursday: { open: '10:00', close: '15:00' },
        friday: { open: '10:00', close: '15:00' },
      },
    });

    const cukrarna = await this.businessRepository.save({
      name: 'Cukrárna u Čmelina',
      address: 'Česká 8, Brno',
      type: 'cukrarna',
      owner_id: owner.id,
      phone: '+420 555 555 666',
      description: 'Domácí zákusky, dorty na zakázku a zmrzlina',
      opening_hours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '19:00' },
        saturday: { open: '10:00', close: '19:00' },
        sunday: { open: '10:00', close: '17:00' },
      },
    });

    const bar = await this.businessRepository.save({
      name: 'Bar u Čmelina',
      address: 'Jakubská 5, Brno',
      type: 'hospoda',
      owner_id: owner.id,
      phone: '+420 555 777 888',
      description: 'Koktejly, craft piva a živá hudba každý pátek',
      opening_hours: {
        monday: { open: '16:00', close: '01:00' },
        tuesday: { open: '16:00', close: '01:00' },
        wednesday: { open: '16:00', close: '01:00' },
        thursday: { open: '16:00', close: '02:00' },
        friday: { open: '16:00', close: '03:00' },
        saturday: { open: '16:00', close: '03:00' },
        sunday: { open: '17:00', close: '00:00' },
      },
    });

    console.log('Podniky vytvořeny');

    // === AKCE ===
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const promo1 = await this.promotionRepository.save({
      business_id: kavarna.id,
      title: 'Espresso 1+1 zdarma',
      description: 'Kup si espresso a druhé dostaneš zdarma! Platí pro všechny druhy espresa.',
      discount_percent: 50,
      start_datetime: now,
      end_datetime: nextWeek,
      target_hours: ['14:00-17:00'],
      limit: 30,
      is_active: true,
    });

    const promo2 = await this.promotionRepository.save({
      business_id: bufet.id,
      title: 'Polední menu -30%',
      description: 'Sleva 30% na kompletní polední menu včetně polévky a nápoje.',
      discount_percent: 30,
      start_datetime: now,
      end_datetime: nextMonth,
      target_hours: ['11:00-14:00'],
      limit: 50,
      is_active: true,
    });

    await this.promotionRepository.save({
      business_id: cukrarna.id,
      title: 'Zmrzlina 2+1',
      description: 'Při koupi dvou kopečků zmrzliny třetí zdarma! Platí na všechny příchutě.',
      discount_percent: 33,
      start_datetime: now,
      end_datetime: nextMonth,
      target_hours: ['12:00-18:00'],
      limit: 100,
      is_active: true,
    });

    await this.promotionRepository.save({
      business_id: bar.id,
      title: 'Happy Hour koktejly',
      description: 'Všechny koktejly za poloviční cenu! Mojito, Aperol Spritz, Gin Tonic...',
      discount_percent: 50,
      start_datetime: now,
      end_datetime: nextWeek,
      target_hours: ['16:00-19:00'],
      limit: 40,
      is_active: true,
    });

    await this.promotionRepository.save({
      business_id: kavarna.id,
      title: 'Cheesecake dne -25%',
      description: 'Denní speciál: domácí cheesecake se slevou 25%.',
      discount_percent: 25,
      start_datetime: now,
      end_datetime: nextMonth,
      is_active: true,
    });

    await this.promotionRepository.save({
      business_id: bufet.id,
      title: 'Páteční burger akce',
      description: 'Každý pátek hovězí burger + hranolky za speciální cenu!',
      discount_percent: 20,
      start_datetime: now,
      end_datetime: nextMonth,
      target_hours: ['11:00-15:00'],
      limit: 25,
      is_active: true,
    });

    console.log('Akce vytvořeny');

    // === EVENTY (analytika) ===
    await this.eventRepository.save({
      promotion_id: promo1.id,
      user_id: owner.id,
      type: 'view',
      metadata: { device: 'mobile', os: 'Android' },
    });

    await this.eventRepository.save({
      promotion_id: promo2.id,
      user_id: owner.id,
      type: 'click',
      metadata: { button: 'details' },
    });

    console.log('Eventy vytvořeny');
    console.log('Seed úspěšně dokončen!');
  }

  private async createUser(
    email: string,
    password: string,
    name: string,
    role: 'user' | 'business_owner' | 'admin',
  ): Promise<User> {
    // Hashuj heslo pomocí bcrypt (stejně jako v auth.service.ts)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save({
      email,
      password_hash: hashedPassword,
      name,
      role,
    });
    return user;
  }
}

