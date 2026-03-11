/**
 * CrowdEase Saved Promotions API
 * Funkce pro ukládání oblíbených akcí
 */

import { apiClient } from './client';
import { Promotion } from './types';

// Typy pro saved promotions API
export interface SavedPromotion {
  id: string;
  user_id: string;
  promotion_id: string;
  created_at: string;
  promotion?: Promotion;
}

export interface SavedPromotionsResponse {
  success: boolean;
  data: SavedPromotion[];
  count: number;
}

export interface SavedPromotionIdsResponse {
  success: boolean;
  data: string[];
}

/**
 * Uložit akci
 */
export async function savePromotion(promotionId: string): Promise<{ success: boolean }> {
  return apiClient.post(`/saved-promotions/${promotionId}`);
}

/**
 * Odebrat uloženou akci
 */
export async function unsavePromotion(promotionId: string): Promise<{ success: boolean }> {
  return apiClient.delete(`/saved-promotions/${promotionId}`);
}

/**
 * Získat seznam uložených akcí
 */
export async function getSavedPromotions(): Promise<SavedPromotionsResponse> {
  return apiClient.get<SavedPromotionsResponse>('/saved-promotions');
}

/**
 * Získat ID uložených akcí
 */
export async function getSavedPromotionIds(): Promise<string[]> {
  const response = await apiClient.get<SavedPromotionIdsResponse>('/saved-promotions/ids');
  return response.data;
}

/**
 * Toggle save - uložit/odebrat akci
 */
export async function toggleSave(promotionId: string, currentlySaved: boolean): Promise<boolean> {
  if (currentlySaved) {
    await unsavePromotion(promotionId);
    return false;
  } else {
    await savePromotion(promotionId);
    return true;
  }
}

export const savedPromotionsApi = {
  savePromotion,
  unsavePromotion,
  getSavedPromotions,
  getSavedPromotionIds,
  toggleSave,
};

export default savedPromotionsApi;

