import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../../entities/follow.entity';
import { Business } from '../../entities/business.entity';

/**
 * FollowsService - služba pro správu sledování podniků
 * 
 * TODO: Přidat notifikace při nových akcích sledovaných podniků
 * TODO: Přidat analytics pro sledování popularity podniků
 * FIXME: Přidat unique constraint na kombinaci user_id + business_id
 */
@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  /**
   * Sledovat podnik
   * @param userId - ID uživatele
   * @param businessId - ID podniku
   * @returns Nový Follow záznam
   */
  async followBusiness(userId: string, businessId: string): Promise<Follow> {
    // Ověř, že podnik existuje
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${businessId} nebyl nalezen`);
    }

    // Zkontroluj, jestli už uživatel sleduje tento podnik
    const existingFollow = await this.followRepository.findOne({
      where: { user_id: userId, business_id: businessId },
    });

    if (existingFollow) {
      throw new BadRequestException(
        `Již sleduješ podnik s ID ${businessId}`,
      );
    }

    // Vytvoř nový Follow záznam
    const follow = this.followRepository.create({
      user_id: userId,
      business_id: businessId,
    });

    return await this.followRepository.save(follow);
  }

  /**
   * Přestat sledovat podnik
   * @param userId - ID uživatele
   * @param businessId - ID podniku
   * @returns Počet smazaných záznamů
   */
  async unfollowBusiness(userId: string, businessId: string): Promise<number> {
    const result = await this.followRepository.delete({
      user_id: userId,
      business_id: businessId,
    });

    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(
        `Nesleduješ podnik s ID ${businessId}`,
      );
    }

    return result.affected;
  }

  /**
   * Získat seznam sledovaných podniků uživatele
   * @param userId - ID uživatele
   * @returns Pole Follow záznamů s informacemi o podnicích
   */
  async getUserFollows(userId: string): Promise<Follow[]> {
    return await this.followRepository.find({
      where: { user_id: userId },
      relations: ['business'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Zkontroluj, jestli uživatel sleduje podnik
   * @param userId - ID uživatele
   * @param businessId - ID podniku
   * @returns true/false
   */
  async isFollowing(userId: string, businessId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { user_id: userId, business_id: businessId },
    });

    return !!follow;
  }

  /**
   * Získat počet sledujících pro podnik
   * @param businessId - ID podniku
   * @returns Počet sledujících
   */
  async getFollowersCount(businessId: string): Promise<number> {
    return await this.followRepository.count({
      where: { business_id: businessId },
    });
  }
}

