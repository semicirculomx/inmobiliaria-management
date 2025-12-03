// Strapi API Client Configuration
const STRAPI_BASE_URL = 'https://dashboard.grupogersan360.com/api';

// Strapi User type
export type StrapiUser = {
  id: number;
  documentId: string;
  email: string;
  password?: string;
  full_name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// Helper function to make API calls to Strapi
export const strapiClient = {
  async get(endpoint: string, options?: { params?: Record<string, unknown> }) {
    const url = new URL(`${STRAPI_BASE_URL}/${endpoint}`);
    
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // For arrays like populate: ['client', 'pdf']
          value.forEach((v, index) => {
            url.searchParams.append(`${key}[${index}]`, String(v));
          });
        } else if (typeof value === 'object' && value !== null) {
          // For nested objects like filters
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            url.searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
          });
        } else {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    // Get JWT token if available
    const token = localStorage.getItem('strapiToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API error response:', errorText);
      throw new Error(`Strapi API error: ${response.status}`);
    }

    return response.json();
  },

  // Authentication function using Strapi's built-in auth
  async authenticateUser(email: string, password: string): Promise<{ user: StrapiUser | null; error: string | null }> {
    try {
      // Use Strapi's native authentication endpoint
      const response = await fetch(`${STRAPI_BASE_URL}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { 
          user: null, 
          error: errorData.error?.message || 'Credenciales incorrectas' 
        };
      }

      const data = await response.json();
      
      // Store JWT token for future requests
      if (data.jwt) {
        localStorage.setItem('strapiToken', data.jwt);
      }

      // Map Strapi auth user to our StrapiUser type
      const user: StrapiUser = {
        id: data.user.id,
        documentId: data.user.documentId || String(data.user.id),
        email: data.user.email,
        full_name: data.user.username || data.user.email,
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt,
        publishedAt: data.user.createdAt,
      };

      return { user, error: null };
    } catch (error) {
      console.error('Authentication error:', error);
      return { user: null, error: 'Error al autenticar' };
    }
  },

  // Get stored JWT token
  getToken(): string | null {
    return localStorage.getItem('strapiToken');
  },

  // Clear stored token
  clearToken(): void {
    localStorage.removeItem('strapiToken');
  },
};

// Strapi types based on your API structure
export type StrapiClient = {
  id: number;
  documentId: string;
  email: string;
  full_name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiBudget = {
  id: number;
  documentId: string;
  title: string;
  pdf_url?: string;
  pdf?: {
    id: number;
    name: string;
    url: string;
    size: number;
    mime: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  client?: StrapiClient;
};

export type StrapiContract = {
  id: number;
  documentId: string;
  title: string;
  pdf_url?: string;
  pdf?: {
    id: number;
    name: string;
    url: string;
    size: number;
    mime: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  client?: StrapiClient;
};

export type StrapiPlan = {
  id: number;
  documentId: string;
  title: string;
  pdf_url?: string;
  pdf?: {
    id: number;
    name: string;
    url: string;
    size: number;
    mime: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  client?: StrapiClient;
};

export type StrapiProjectPhoto = {
  id: number;
  documentId: string;
  description?: string;
  image_url?: string;
  image?: {
    id: number;
    name: string;
    url: string;
    size: number;
    mime: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  client?: StrapiClient;
};

// Response wrapper from Strapi
export type StrapiResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingleResponse<T> = {
  data: T;
  meta: Record<string, unknown>;
};
