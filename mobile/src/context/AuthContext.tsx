/**
 * CrowdEase Auth Context
 * Globální stav autentizace pro celou aplikaci
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '../api';
import { storage } from '../utils';

// Typy pro context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Vytvoření contextu
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props pro provider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - obalí celou aplikaci a poskytne auth stav
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kontrola tokenu při startu aplikace
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Zkusit získat uloženého uživatele
      const storedUser = await authApi.getStoredUser();

      if (storedUser) {
        // Máme uloženého uživatele, ověříme token voláním /auth/me
        const token = await storage.getToken();
        if (token) {
          try {
            // Ověříme, že token je stále platný
            await authApi.getMe();
            setUser(storedUser);
          } catch {
            // Token je neplatný -> vymazat a zobrazit login
            console.log('Token expired or invalid, clearing...');
            await storage.clear();
          }
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      await storage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register(name, email, password);
    setUser(response.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook - přístup k auth stavu odkudkoliv v aplikaci
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth musí být použit uvnitř AuthProvider');
  }
  
  return context;
};

export default AuthContext;

