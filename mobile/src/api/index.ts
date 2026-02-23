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

// Types
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiError,
  Promotion,
  Business,
} from './types';

