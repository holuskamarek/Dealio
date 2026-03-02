/**
 * CrowdEase Promotions API
 * Funkce pro práci s akcemi
 */

import { apiClient } from './client';
import { Promotion, ApiListResponse, ApiDetailResponse } from './types';

/**
 * Získat všechny akce
 */
export async function getPromotions(): Promise<ApiListResponse<Promotion>> {
  return apiClient.get<ApiListResponse<Promotion>>('/promotions');
}

/**
 * Získat aktivní akce
 */
export async function getActivePromotions(): Promise<ApiListResponse<Promotion>> {
  return apiClient.get<ApiListResponse<Promotion>>('/promotions?active=true');
}

/**
 * Získat detail jedné akce
 */
export async function getPromotion(id: string): Promise<ApiDetailResponse<Promotion>> {
  return apiClient.get<ApiDetailResponse<Promotion>>(`/promotions/${id}`);
}

export const promotionsApi = {
  getPromotions,
  getActivePromotions,
  getPromotion,
};

export default promotionsApi;

