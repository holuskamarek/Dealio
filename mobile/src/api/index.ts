/**
 * CrowdEase API
 * Export všech API funkcí a typů
 */

// API Client
export { apiClient } from './client';

// Auth API
export { authApi } from './auth';
export {
  login,
  register,
  logout,
  getMe,
  isLoggedIn,
  getStoredUser,
} from './auth';

// Promotions API
export { promotionsApi } from './promotions';
export {
  getPromotions,
  getActivePromotions,
  getPromotion,
} from './promotions';

// Redemptions API
export { redemptionsApi } from './redemptions';
export { createRedemption } from './redemptions';

// Saved Promotions API
export { savedPromotionsApi } from './follows';
export {
  savePromotion,
  unsavePromotion,
  getSavedPromotions,
  getSavedPromotionIds,
  toggleSave,
} from './follows';
export type { SavedPromotion, SavedPromotionsResponse } from './follows';

// Types
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiError,
  Promotion,
  Business,
  Redemption,
  CreateRedemptionResponse,
  ApiListResponse,
  ApiDetailResponse,
} from './types';

