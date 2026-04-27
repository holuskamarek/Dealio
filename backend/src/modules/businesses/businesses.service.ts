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


  async findById(id: string) {
    try {
      const business = await this.businessRepository.findOne({
        where: { id },
        relations: ['owner', 'promotions'],
      });

      if (!business) {
        throw new NotFoundException(`Podnik s ID ${id} nebyl nalezen`);
      }

      return business;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in findById:', error);
      throw new NotFoundException(`Podnik s ID ${id} nebyl nalezen`);
    }
  }

  async findByOwner(ownerId: string) {
    const business = await this.businessRepository.findOne({
      where: { owner_id: ownerId },
    });

    if (!business) {
      throw new NotFoundException('Nemáš žádný podnik');
    }

    return {
      success: true,
      data: business,
    };
  }

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

  async create(data: any, owner: User) {
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

  async update(id: string, data: any, user: User) {
    const business = await this.businessRepository.findOne({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${id} nebyl nalezen`);
    }

    if (business.owner_id !== user.id) {
      throw new ForbiddenException('Nemáš oprávnění upravit tento podnik');
    }


    if (data.name) business.name = data.name;
    if (data.address) business.address = data.address;
    if (data.type) business.type = data.type;
    if (data.phone !== undefined) business.phone = data.phone;
    if (data.website !== undefined) business.website = data.website;
    if (data.description !== undefined) business.description = data.description;
    if (data.opening_hours) business.opening_hours = data.opening_hours;
    if (data.image_url !== undefined) business.image_url = data.image_url;

    await this.businessRepository.save(business);

    return {
      success: true,
      message: 'Podnik byl úspěšně aktualizován',
      data: business,
    };
  }


  async delete(id: string, user: User) {
    const business = await this.businessRepository.findOne({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${id} nebyl nalezen`);
    }


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

