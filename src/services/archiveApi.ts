import type { PaginatedResponse } from "../types";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/digital-repo`;

export interface ArchiveType {
  id: number;
  name: string;
  slug: string;
  description: string;
  archive_count: number;
}

export interface Archive {
  id: string;
  title: string;
  slug: string;
  description: string;
  archive_type: ArchiveType;
  external_url: string;
  thumbnail_url?: string;
  source_institution: string;
  date_created?: string;
  language: string;
  access_level: string;
  status: string;
  tags_list: string[];
  view_count: number;
  click_count: number;
  uploaded_by_username: string;
  created_at: string;
}

export interface ArchiveResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Archive[];
}

class ArchiveApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
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
      console.error('Archive API request failed:', error);
      throw error;
    }
  }

  // Get all archive types
  async getArchiveTypes(): Promise<PaginatedResponse<ArchiveType>> {
    const response = await this.request<PaginatedResponse<ArchiveType>>('/archives/types/');
    return response;
  }

  // Get archives with filters
  async getArchives(params?: {
    type?: string;
    search?: string;
    archive_type?: string;
    access_level?: string;
    language?: string;
    page?: number;
    page_size?: number;
  }): Promise<ArchiveResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/archives/${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<ArchiveResponse>(endpoint);
  }

  // Get archives by type
  async getArchivesByType(typeSlug: string): Promise<{
    archive_type: ArchiveType;
    archives: Archive[];
  }> {
    return await this.request(`/archives/by_type/?type=${typeSlug}`);
  }

  // Get single archive
  async getArchive(slug: string): Promise<Archive> {
    return await this.request<Archive>(`/archives/${slug}/`);
  }

  // Track archive click
  async trackClick(slug: string): Promise<{ message: string }> {
    return await this.request(`/archives/${slug}/track_click/`, {
      method: 'POST',
    });
  }

  // Create new archive (for authenticated users)
  async createArchive(archiveData: {
    title: string;
    description: string;
    archive_type_id: number;
    external_url: string;
    thumbnail_url?: string;
    source_institution: string;
    date_created?: string;
    language?: string;
    access_level?: string;
    tags?: string;
  }): Promise<Archive> {
    return await this.request<Archive>('/archives/', {
      method: 'POST',
      body: JSON.stringify(archiveData),
    });
  }

  // Update archive
  async updateArchive(slug: string, archiveData: Partial<Archive>): Promise<Archive> {
    return await this.request<Archive>(`/archives/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(archiveData),
    });
  }

  // Delete archive
  async deleteArchive(slug: string): Promise<void> {
    await this.request(`/archives/${slug}/`, {
      method: 'DELETE',
    });
  }
}

export const archiveApiService = new ArchiveApiService();
