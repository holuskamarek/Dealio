import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business, User } from '../../entities';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  /**
   * Vrátí seznam všech podniků
   * TODO: Přidat pagination (limit, offset)
   * TODO: Přidat filtrování podle typu (kavárna, bistro, atd.)
   */
  async findAll() {
    const businesses = await this.businessRepository.find({
      relations: ['owner', 'promotions'],
      order: {
        created_at: 'DESC',
      },
    });

    return {
      success: true,
      data: businesses,
      count: businesses.length,
    };
  }

  /**
   * Vrátí detail jednoho podniku
   * FIXME: Pokud podnik neexistuje, vrátí 404
   */
  async findById(id: string) {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['owner', 'promotions'],
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${id} nebyl nalezen`);
    }

    return {
      success: true,
      data: business,
    };
  }

  /**
   * Vrátí podniky podle typu
   * TODO: Implementovat filtrování
   */
  async findByType(type: string) {
    const businesses = await this.businessRepository.find({
      where: { type: type as any },
      relations: ['owner', 'promotions'],
    });

    return {
      success: true,
      data: businesses,
      count: businesses.length,
    };
  }

  /**
   * Vytvoří nový podnik
   * TODO: Přidat validaci vstupů (DTO)
   * TODO: Přidat kontrolu, jestli uživatel je business_owner
   */
  async create(data: any, owner: User) {
    // FIXME: Validace by měla být v DTO
    if (!data.name || !data.address || !data.type) {
      throw new BadRequestException('Chybí povinná pole: name, address, type');
    }

    const business = this.businessRepository.create({
      name: data.name,
      address: data.address,
      type: data.type,
      owner_id: owner.id,
      phone: data.phone,
      website: data.website,
      description: data.description,
      opening_hours: data.opening_hours,
    });

    await this.businessRepository.save(business);

    return {
      success: true,
      message: 'Podnik byl úspěšně vytvořen',
      data: business,
    };
  }

  /**
   * Upraví existující podnik
   * Jen vlastník může upravit svůj podnik
   */
  async update(id: string, data: any, user: User) {
    const business = await this.businessRepository.findOne({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${id} nebyl nalezen`);
    }

    // Zkontroluj, jestli je uživatel vlastník
    if (business.owner_id !== user.id) {
      throw new ForbiddenException('Nemáš oprávnění upravit tento podnik');
    }

    // Aktualizuj pole
    if (data.name) business.name = data.name;
    if (data.address) business.address = data.address;
    if (data.type) business.type = data.type;
    if (data.phone) business.phone = data.phone;
    if (data.website) business.website = data.website;
    if (data.description) business.description = data.description;
    if (data.opening_hours) business.opening_hours = data.opening_hours;

    await this.businessRepository.save(business);

    return {
      success: true,
      message: 'Podnik byl úspěšně aktualizován',
      data: business,
    };
  }

  /**
   * Smaže podnik
   * Jen vlastník může smazat svůj podnik
   */
  async delete(id: string, user: User) {
    const business = await this.businessRepository.findOne({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${id} nebyl nalezen`);
    }

    // Zkontroluj, jestli je uživatel vlastník
    if (business.owner_id !== user.id) {
      throw new ForbiddenException('Nemáš oprávnění smazat tento podnik');
    }

    await this.businessRepository.remove(business);

    return {
      success: true,
      message: 'Podnik byl úspěšně smazán',
    };
  }
}

