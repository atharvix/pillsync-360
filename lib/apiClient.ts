/**
 * API Client for Backend Communication
 * Handles authentication and API requests to the Express backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

/**
 * Get Firebase ID token for authenticated requests
 */
export async function getAuthToken(): Promise<string> {
  try {
    const { auth } = await import('@/src/firebase');
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error('Failed to get auth token:', error);
    throw error;
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  /**
   * Verify Firebase ID token
   */
  verify: async () => {
    return apiRequest<{ success: boolean; data: any }>('/api/auth/verify');
  },

  /**
   * Get authenticated user's profile
   */
  getProfile: async () => {
    return apiRequest<{ success: boolean; data: any }>('/api/auth/profile');
  },
};

/**
 * Medications API
 */
export const medicationAPI = {
  /**
   * Get all medications for authenticated user
   */
  getAll: async () => {
    return apiRequest<{ success: boolean; data: any[]; count: number }>('/api/medications');
  },

  /**
   * Get single medication by ID
   */
  getOne: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/api/medications/${id}`);
  },

  /**
   * Create new medication
   */
  create: async (medication: {
    name: string;
    dosage: string;
    frequency?: string;
    start?: string;
    end?: string;
    addedBy?: string;
  }) => {
    return apiRequest<{ success: boolean; data: any; message: string }>('/api/medications', {
      method: 'POST',
      body: JSON.stringify(medication),
    });
  },

  /**
   * Update medication
   */
  update: async (id: string, updates: Partial<{
    name: string;
    dosage: string;
    frequency: string;
    start: string;
    end: string;
    addedBy: string;
  }>) => {
    return apiRequest<{ success: boolean; data: any; message: string }>(`/api/medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete medication
   */
  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/medications/${id}`, {
      method: 'DELETE',
    });
  },
};

