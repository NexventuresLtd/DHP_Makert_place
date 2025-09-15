import type { Category, Collection, Exhibition, Artist, Artwork, PaginatedResponse } from '../types';
const API_BASE_URL =  `${import.meta.env.VITE_API_BASE_URL}/api/digital-repo`;

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<PaginatedResponse<Category>> {
    return this.request<PaginatedResponse<Category>>('/categories/');
  }

  async createCategory(categoryData: { name: string; description?: string }): Promise<Category> {
    return this.request<Category>('/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Collections
  async getCollections(params?: {
    collection_type?: string;
    is_featured?: boolean;
    search?: string;
    page?: number;
  }): Promise<PaginatedResponse<Collection>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Collection>>(`/collections/${query ? `?${query}` : ''}`);
  }

  async getCollection(slug: string): Promise<Collection> {
    return this.request<Collection>(`/collections/${slug}/`);
  }

  // Artworks
  async getArtworks(params?: {
    category?: string;
    collection?: string;
    artwork_type?: string;
    is_featured?: boolean;
    search?: string;
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<Artwork>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Artwork>>(`/artworks/${query ? `?${query}` : ''}`);
  }

  async getArtwork(slug: string): Promise<Artwork> {
    return this.request<Artwork>(`/artworks/${slug}/`);
  }

  async incrementArtworkView(slug: string): Promise<void> {
    await this.request(`/artworks/${slug}/view/`, {
      method: 'POST',
    });
  }

  async getFeaturedArtworks(): Promise<Artwork[]> {
    return this.request<Artwork[]>('/artworks/featured/');
  }

  async getRecentArtworks(): Promise<Artwork[]> {
    return this.request<Artwork[]>('/artworks/recent/');
  }

  async getPopularArtworks(): Promise<Artwork[]> {
    return this.request<Artwork[]>('/artworks/popular/');
  }

  async createArtwork(formData: FormData): Promise<Artwork> {
    const url = `${API_BASE_URL}/artworks/`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method: 'POST',
      headers,
      body: formData,
      // Don't set Content-Type header for FormData - browser will set it with boundary
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in to upload artworks');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async updateArtwork(slug: string, formData: FormData): Promise<Artwork> {
    const url = `${API_BASE_URL}/artworks/${slug}/`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method: 'PATCH', // Use PATCH instead of PUT for partial updates
      headers,
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in to update artworks');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to update this artwork');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async patchArtwork(slug: string, updates: any): Promise<Artwork> {
    const url = `${API_BASE_URL}/artworks/${slug}/`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in to update artworks');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to update this artwork');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async deleteArtwork(slug: string): Promise<void> {
    const url = `${API_BASE_URL}/artworks/${slug}/`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method: 'DELETE',
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in to delete artworks');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to delete this artwork');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async bulkDeleteArtworks(slugs: string[]): Promise<void> {
    // For bulk delete, we'll delete each artwork individually
    const deletePromises = slugs.map(slug => this.deleteArtwork(slug));
    await Promise.all(deletePromises);
  }

  async searchArtworks(params: {
    q?: string;
    category?: string;
    year_from?: number;
    year_to?: number;
    page?: number;
  }): Promise<PaginatedResponse<Artwork>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    return this.request<PaginatedResponse<Artwork>>(`/artworks/search/?${searchParams.toString()}`);
  }

  // Exhibitions
  async getExhibitions(params?: {
    search?: string;
    page?: number;
  }): Promise<PaginatedResponse<Exhibition>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Exhibition>>(`/exhibitions/${query ? `?${query}` : ''}`);
  }

  async getActiveExhibitions(): Promise<Exhibition[]> {
    return this.request<Exhibition[]>('/exhibitions/active/');
  }

  async getExhibition(slug: string): Promise<Exhibition> {
    return this.request<Exhibition>(`/exhibitions/${slug}/`);
  }

  // Artists
  async getArtists(params?: {
    search?: string;
    page?: number;
  }): Promise<PaginatedResponse<Artist>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Artist>>(`/artists/${query ? `?${query}` : ''}`);
  }

  async getArtist(slug: string): Promise<Artist> {
    return this.request<Artist>(`/artists/${slug}/`);
  }
}

export const apiService = new ApiService();

