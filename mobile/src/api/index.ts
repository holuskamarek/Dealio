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

// Types
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiError,
  Promotion,
  Business,
  ApiListResponse,
  ApiDetailResponse,
} from './types';

