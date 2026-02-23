/**
 * CrowdEase Storage Utils
 * AsyncStorage helper pro ukládání tokenů a dat
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Klíče pro storage
const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
};

/**
 * Token management
 */
export const storage = {
  // Získat token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  },

  // Uložit token
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Chyba při ukládání tokenu:', error);
    }
  },

  // Smazat token
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Chyba při mazání tokenu:', error);
    }
  },

  // Získat uživatele
  async getUser<T>(): Promise<T | null> {
    try {
      const user = await AsyncStorage.getItem(KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Uložit uživatele
  async setUser<T>(user: T): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Chyba při ukládání uživatele:', error);
    }
  },

  // Smazat uživatele
  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER);
    } catch (error) {
      console.error('Chyba při mazání uživatele:', error);
    }
  },

  // Vymazat vše (logout)
  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.USER]);
    } catch (error) {
      console.error('Chyba při mazání storage:', error);
    }
  },
};

export default storage;

