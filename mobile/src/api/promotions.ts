/**
 * CrowdEase Promotions API
 * Funkce pro práci s akcemi
 */

import { apiClient } from './client';
import { Promotion, ApiListResponse, ApiDetailResponse } from './types';

export async function getPromotions(): Promise<ApiListResponse<Promotion>> {
  return apiClient.get<ApiListResponse<Promotion>>('/promotions');
}

export async function getActivePromotions(): Promise<ApiListResponse<Promotion>> {
  return apiClient.get<ApiListResponse<Promotion>>('/promotions?active=true');
}

export async function getPromotion(id: string): Promise<ApiDetailResponse<Promotion>> {
  return apiClient.get<ApiDetailResponse<Promotion>>(`/promotions/${id}`);
}

export async function getPromotionsByBusiness(businessId: string): Promise<ApiListResponse<Promotion>> {
  return apiClient.get<ApiListResponse<Promotion>>(`/promotions/business/${businessId}`);
}

export const promotionsApi = {
  getPromotions,
  getActivePromotions,
  getPromotion,
  getPromotionsByBusiness,
};

export default promotionsApi;

