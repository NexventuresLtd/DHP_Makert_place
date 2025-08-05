const API_BASE_URL = `${import.meta.env.BASE_URL}/api/digital-repo`;

export interface UserContentItem {
  id: string;
  title: string;
  type: 'artwork' | 'document' | 'museum' | 'collection';
  thumbnail?: string;
  image?: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: 'published' | 'draft' | 'archived' | 'private';
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  category?: string;
  tags?: string[];
  file_size?: number;
  access_level?: 'public' | 'private' | 'restricted';
}

export interface UserContentStats {
  total_items: number;
  total_views: number;
  total_downloads: number;
  total_likes: number;
  total_comments: number;
  by_type: {
    artworks: number;
    documents: number;
    museums: number;
    collections: number;
  };
}

export interface UserContentResponse {
  content: UserContentItem[];
  stats: UserContentStats;
}

class UserContentService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

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

  /**
   * Get all content uploaded by the current user
   */
  async getUserContent(): Promise<UserContentResponse> {
    return this.request<UserContentResponse>('/user/content/');
  }

  /**
   * Delete a content item
   */
  async deleteContent(contentId: string, contentType: string): Promise<void> {
    const endpoints = {
      artwork: '/artworks',
      document: '/library/documents',
      museum: '/museums',
      collection: '/collections'
    };

    const endpoint = endpoints[contentType as keyof typeof endpoints];
    if (!endpoint) {
      throw new Error(`Unknown content type: ${contentType}`);
    }

    await this.request(`${endpoint}/${contentId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Update content status
   */
  async updateContentStatus(
    contentId: string, 
    contentType: string, 
    status: 'published' | 'draft' | 'archived' | 'private'
  ): Promise<void> {
    const endpoints = {
      artwork: '/artworks',
      document: '/library/documents',
      museum: '/museums',
      collection: '/collections'
    };

    const endpoint = endpoints[contentType as keyof typeof endpoints];
    if (!endpoint) {
      throw new Error(`Unknown content type: ${contentType}`);
    }

    const updateData: any = {};
    
    if (contentType === 'artwork') {
      updateData.is_public = status === 'published';
    } else if (contentType === 'museum') {
      updateData.status = status;
    } else if (contentType === 'document') {
      updateData.access_level = status === 'published' ? 'public' : 'private';
    }

    await this.request(`${endpoint}/${contentId}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  /**
   * Get content by type
   */
  async getContentByType(type: string): Promise<UserContentItem[]> {
    const response = await this.getUserContent();
    return response.content.filter(item => item.type === type);
  }

  /**
   * Search user content
   */
  async searchUserContent(query: string): Promise<UserContentItem[]> {
    const response = await this.getUserContent();
    const searchTerm = query.toLowerCase();
    
    return response.content.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

export const userContentService = new UserContentService();
export default userContentService;
