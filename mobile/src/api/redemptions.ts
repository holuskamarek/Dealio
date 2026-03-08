/**
 * CrowdEase Redemptions API
 * Funkce pro práci s uplatněním slev
 */

import { apiClient } from './client';
import { CreateRedemptionResponse } from './types';

/**
 * Vytvořrení redemption (uplatnění slevy) pro akci
 * POST /redemptions/promotions/:promotionId
 */
export async function createRedemption(promotionId: string): Promise<CreateRedemptionResponse> {
  return apiClient.post<CreateRedemptionResponse>(`/redemptions/promotions/${promotionId}`, {});
}

export const redemptionsApi = {
  createRedemption,
};

export default redemptionsApi;

