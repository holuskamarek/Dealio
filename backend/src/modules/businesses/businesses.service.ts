import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../../entities';

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
}

