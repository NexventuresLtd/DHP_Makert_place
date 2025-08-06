const API_BASE_URL =  `${import.meta.env.VITE_API_BASE_URL}/api/digital-repo`;

export interface DigitalContentType {
  id: number;
  name: string;
  slug: string;
  description: string;
  content_count: number;
}

export interface DigitalContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  content_type: DigitalContentType;
  external_url: string;
  thumbnail_url?: string;
  source_organization: string;
  license?: string;
  format_type?: string;
  size?: string;
  language: string;
  access_level: string;
  status: string;
  tags_list: string[];
  view_count: number;
  click_count: number;
  uploaded_by_username: string;
  created_at: string;
}

export interface DigitalContentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DigitalContent[];
}

class DigitalContentApiService {
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
      console.error('Digital Content API request failed:', error);
      throw error;
    }
  }

  // Get all digital content types
  async getDigitalContentTypes(): Promise<DigitalContentType[]> {
    const response = await this.request<DigitalContentType[]>('/digital-content/types/');
    return response;
  }

  // Get digital content with filters
  async getDigitalContents(params?: {
    type?: string;
    search?: string;
    content_type?: string;
    access_level?: string;
    language?: string;
    format_type?: string;
    page?: number;
    page_size?: number;
  }): Promise<DigitalContentResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/digital-content/${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<DigitalContentResponse>(endpoint);
  }

  // Get digital content by type
  async getDigitalContentByType(typeSlug: string): Promise<{
    content_type: DigitalContentType;
    contents: DigitalContent[];
  }> {
    return await this.request(`/digital-content/by_type/?type=${typeSlug}`);
  }

  // Get single digital content
  async getDigitalContent(slug: string): Promise<DigitalContent> {
    return await this.request<DigitalContent>(`/digital-content/${slug}/`);
  }

  // Track digital content click
  async trackClick(slug: string): Promise<{ message: string }> {
    return await this.request(`/digital-content/${slug}/track_click/`, {
      method: 'POST',
    });
  }

  // Create new digital content (for authenticated users)
  async createDigitalContent(contentData: {
    title: string;
    description: string;
    content_type_id: number;
    external_url: string;
    thumbnail_url?: string;
    source_organization: string;
    license?: string;
    format_type?: string;
    size?: string;
    language?: string;
    access_level?: string;
    tags?: string;
  }): Promise<DigitalContent> {
    return await this.request<DigitalContent>('/digital-content/', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  }

  // Update digital content
  async updateDigitalContent(slug: string, contentData: Partial<DigitalContent>): Promise<DigitalContent> {
    return await this.request<DigitalContent>(`/digital-content/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(contentData),
    });
  }

  // Delete digital content
  async deleteDigitalContent(slug: string): Promise<void> {
    await this.request(`/digital-content/${slug}/`, {
      method: 'DELETE',
    });
  }
}

export const digitalContentApiService = new DigitalContentApiService();
