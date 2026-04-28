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

    const businessCount = await this.businessRepository.count();
    if (businessCount === 0) {
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
    } else {
      console.log('Základní podniky už existují, přeskakuji prvotní seed');
    }

    await this.seedSecondaryOwners();

    console.log('Seed úspěšně dokončen!');
  }

  private async seedSecondaryOwners() {
    const owners = [
      {
        email: 'jana@example.com',
        password: 'password123',
        name: 'Jana Nováková',
        business: {
          name: 'Pizzerie Roma',
          address: 'Veveří 22, Brno',
          type: 'pizzerie' as const,
          phone: '+420 555 222 333',
          description: 'Pravá italská pizza z pece na dřevo',
          opening_hours: {
            monday: { open: '11:00', close: '22:00' },
            tuesday: { open: '11:00', close: '22:00' },
            wednesday: { open: '11:00', close: '22:00' },
            thursday: { open: '11:00', close: '22:00' },
            friday: { open: '11:00', close: '23:00' },
            saturday: { open: '12:00', close: '23:00' },
            sunday: { open: '12:00', close: '21:00' },
          },
        },
        promotion: {
          title: 'Pizza Margherita -20%',
          description: 'Klasika za skvělou cenu, každý všední den.',
          discount_percent: 20,
          target_hours: ['11:00-15:00'],
          limit: 40,
        },
      },
      {
        email: 'tomas@example.com',
        password: 'password123',
        name: 'Tomáš Svoboda',
        business: {
          name: 'Květinářství Tulipán',
          address: 'Lidická 8, Brno',
          type: 'kvetinarstvi' as const,
          phone: '+420 555 444 555',
          description: 'Čerstvé květiny a kytice na míru',
          opening_hours: {
            monday: { open: '08:00', close: '18:00' },
            tuesday: { open: '08:00', close: '18:00' },
            wednesday: { open: '08:00', close: '18:00' },
            thursday: { open: '08:00', close: '18:00' },
            friday: { open: '08:00', close: '18:00' },
            saturday: { open: '09:00', close: '14:00' },
          },
        },
        promotion: {
          title: 'Kytice ke svátku -15%',
          description: 'Sleva 15% na všechny vázané kytice.',
          discount_percent: 15,
          limit: 20,
        },
      },
    ];

    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    for (const o of owners) {
      let user = await this.userRepository.findOne({ where: { email: o.email } });
      if (!user) {
        user = await this.createUser(o.email, o.password, o.name, 'business_owner');
        console.log(`Vytvoren majitel: ${o.email}`);
      }

      let business = await this.businessRepository.findOne({
        where: { name: o.business.name },
      });
      if (!business) {
        business = await this.businessRepository.save({
          ...o.business,
          owner_id: user.id,
        });
        console.log(`Vytvoren podnik: ${o.business.name}`);
      }

      const existingPromo = await this.promotionRepository.findOne({
        where: { title: o.promotion.title },
      });
      if (!existingPromo) {
        await this.promotionRepository.save({
          ...o.promotion,
          business_id: business.id,
          start_datetime: now,
          end_datetime: nextMonth,
          is_active: true,
        });
        console.log(`Vytvorena akce: ${o.promotion.title}`);
      }
    }
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

