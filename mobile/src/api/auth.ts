/**
 * CrowdEase Auth API
 * Funkce pro autentizaci
 */

import { apiClient } from './client';
import { storage } from '../utils/storage';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from './types';

/**
 * Přihlášení uživatele
 * @param email - Email uživatele
 * @param password - Heslo uživatele
 * @returns AuthResponse s tokenem a uživatelem
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const data: LoginRequest = { email, password };
  const response = await apiClient.post<AuthResponse>('/auth/login', data);

  // Uložit token a uživatele
  await storage.setToken(response.access_token);
  await storage.setUser(response.user);

  return response;
}

/**
 * Registrace nového uživatele
 * @param name - Jméno uživatele
 * @param email - Email uživatele
 * @param password - Heslo uživatele
 * @returns AuthResponse s tokenem a uživatelem
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const data: RegisterRequest = { name, email, password };
  const response = await apiClient.post<AuthResponse>('/auth/register', data);

  // Uložit token a uživatele
  await storage.setToken(response.access_token);
  await storage.setUser(response.user);

  return response;
}

/**
 * Odhlášení uživatele
 * Smaže token a uživatele z storage
 */
export async function logout(): Promise<void> {
  await storage.clear();
}

/**
 * Získat aktuálního přihlášeného uživatele
 * @returns User nebo null pokud není přihlášen
 */
export async function getMe(): Promise<User> {
  const response = await apiClient.get<{ data: User }>('/auth/me');
  const user = response.data;
  // Ulozit pouze pokud user existuje
  if (user) {
    await storage.setUser(user);
  }
  return user;
}

/**
 * Zkontrolovat jestli je uživatel přihlasenej
 * @returns true pokud má uložený token
 */
export async function isLoggedIn(): Promise<boolean> {
  const token = await storage.getToken();
  return !!token;
}

/**
 * Získat uloženého uživatele z storage (bez API volání)
 */
export async function getStoredUser(): Promise<User | null> {
  return storage.getUser<User>();
}

export const authApi = {
  login,
  register,
  logout,
  getMe,
  isLoggedIn,
  getStoredUser,
};

export default authApi;

