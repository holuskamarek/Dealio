/**
 * CrowdEase Redemptions API
 * Funkce pro práci s uplatněním slev
 */

import { apiClient } from './client';
import { CreateRedemptionResponse, Redemption } from './types';

interface RedemptionsResponse {
  success: boolean;
  message: string;
  data: Redemption[];
  count: number;
}

/**
 * Vytvořrení redemption (uplatnění slevy) pro akci
 * POST /redemptions/promotions/:promotionId
 */
export async function createRedemption(promotionId: string): Promise<CreateRedemptionResponse> {
  return apiClient.post<CreateRedemptionResponse>(`/redemptions/promotions/${promotionId}`, {});
}

/**
 * Získat všechny redemptions uživatele
 * GET /redemptions/me
 */
export async function getMyRedemptions(): Promise<RedemptionsResponse> {
  return apiClient.get<RedemptionsResponse>('/redemptions/me');
}

/**
 * Získat aktivní (nepoužité) redemptions uživatele
 * GET /redemptions/me/active
 */
export async function getActiveRedemptions(): Promise<RedemptionsResponse> {
  return apiClient.get<RedemptionsResponse>('/redemptions/me/active');
}

/**
 * Získat použité redemptions uživatele (is_used = true)
 */
export async function getUsedRedemptions(): Promise<Redemption[]> {
  const response = await getMyRedemptions();
  return response.data.filter((r) => r.is_used);
}

export const redemptionsApi = {
  createRedemption,
  getMyRedemptions,
  getActiveRedemptions,
  getUsedRedemptions,
};

export default redemptionsApi;

