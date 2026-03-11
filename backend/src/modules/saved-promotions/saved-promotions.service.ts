import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedPromotion } from '../../entities/saved-promotion.entity';
import { Promotion } from '../../entities/promotion.entity';

@Injectable()
export class SavedPromotionsService {
  constructor(
    @InjectRepository(SavedPromotion)
    private savedPromotionRepository: Repository<SavedPromotion>,
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  /**
   * Uložit akci
   */
  async savePromotion(userId: string, promotionId: string): Promise<SavedPromotion> {
    // Ověř, že akce existuje
    const promotion = await this.promotionRepository.findOne({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new NotFoundException(`Akce s ID ${promotionId} nebyla nalezena`);
    }

    // Zkontroluj, jestli už není uložená
    const existing = await this.savedPromotionRepository.findOne({
      where: { user_id: userId, promotion_id: promotionId },
    });

    if (existing) {
      throw new BadRequestException(`Akce je již uložená`);
    }

    const saved = this.savedPromotionRepository.create({
      user_id: userId,
      promotion_id: promotionId,
    });

    return await this.savedPromotionRepository.save(saved);
  }

  /**
   * Odebrat uloženou akci
   */
  async unsavePromotion(userId: string, promotionId: string): Promise<void> {
    const result = await this.savedPromotionRepository.delete({
      user_id: userId,
      promotion_id: promotionId,
    });

    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(`Akce není uložená`);
    }
  }

  /**
   * Získat seznam uložených akcí uživatele
   */
  async getSavedPromotions(userId: string): Promise<SavedPromotion[]> {
    return await this.savedPromotionRepository.find({
      where: { user_id: userId },
      relations: ['promotion', 'promotion.business'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Zkontrolovat jestli je akce uložená
   */
  async isSaved(userId: string, promotionId: string): Promise<boolean> {
    const saved = await this.savedPromotionRepository.findOne({
      where: { user_id: userId, promotion_id: promotionId },
    });
    return !!saved;
  }

  /**
   * Získat ID všech uložených akcí uživatele (pro efektivní kontrolu v UI)
   */
  async getSavedPromotionIds(userId: string): Promise<string[]> {
    const saved = await this.savedPromotionRepository.find({
      where: { user_id: userId },
      select: ['promotion_id'],
    });
    return saved.map((s) => s.promotion_id);
  }
}

