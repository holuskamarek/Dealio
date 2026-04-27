/**
 * CrowdEase API Types
 * TypeScript typy pro API požadavky a odpovědi
 */



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


export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}


export interface ApiError {
  message: string;
  statusCode: number;
}



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
  image_url?: string;
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
  image_url?: string;
  opening_hours?: Record<string, { open: string; close: string }>;
  created_at: string;
  updated_at: string;
}
export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  count: number;
}

export interface ApiDetailResponse<T> {
  success: boolean;
  data: T;
}

export interface Redemption {
  id: string;
  promotion_id: string;
  user_id: string;
  pin_code: string;
  is_used: boolean;
  used_at?: string;
  created_at: string;
  updated_at: string;
  promotion?: Promotion;
  user?: User;
}

export interface CreateRedemptionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    pin_code: string;
    promotion_id: string;
    created_at: string;
  };
}

