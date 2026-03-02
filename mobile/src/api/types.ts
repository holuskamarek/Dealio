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
  success: boolean;
  message: string;
  access_token: string;
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


// Promotion Types
export interface Promotion {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  discount_percent: number;
  start_datetime: string;
  end_datetime: string;
  target_hours?: string[];
  limit?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  business?: Business;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  type: 'kavárna' | 'bistro' | 'restaurace' | 'bar' | 'cukrárna' | 'jiné';
  owner_id: string;
  phone?: string;
  website?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// API List Response
export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  count: number;
}

// API Detail Response
export interface ApiDetailResponse<T> {
  success: boolean;
  data: T;
}

