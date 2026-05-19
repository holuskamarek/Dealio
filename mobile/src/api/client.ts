/**
 * CrowdEase API Client
 * Fetch wrapper s base URL a automatickým přidáním tokenu
 */

import { storage } from '../utils/storage';
import { ApiError } from './types';


// Sem vlož svoji IP
const API_URL = 'http://172.20.10.11:3000';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await storage.getToken();

  const url = `${API_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = {
      message: data.message || 'Něco se pokazilo',
      statusCode: response.status,
    };
    throw error;
  }

  return data as T;
}

// GET požadavek
export function get<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
  });
}

//POST požadavek
export function post<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

//PUT požadavek
export function put<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

// DELETE požadavek
export function del<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

export const apiClient = {
  get,
  post,
  put,
  delete: del,
  request: apiRequest,
};

export default apiClient;

