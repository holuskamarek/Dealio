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

