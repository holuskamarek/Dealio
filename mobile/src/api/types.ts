/**
 * CrowdEase API Types
 * TypeScript typy pro API požadavky a odpovědi
 */


// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}


// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}


// API Response Types
export interface ApiError {
  message: string;
  statusCode: number;
}


// Promotion Types (pro budoucí použití)
export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  validFrom: string;
  validTo: string;
  businessId: string;
  business?: Business;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  imageUrl?: string;
}

