import type { 
  Author, 
  Publisher, 
  DocumentType, 
  Subject, 
  LibraryDocument, 
  LibraryDocumentDetail,
  LibraryCollection,
  LibraryCollectionDetail,
  ReadingList,
  ReadingListDetail,
  DocumentReview,
  PaginatedResponse 
} from '../types/libraryTypes';

const API_BASE_URL = 'http://localhost:8000/api/digital-repo/library';

class LibraryApiService {
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

  // Documents
  async getDocuments(params?: {
    document_type?: number;
    access_level?: string;
    is_featured?: boolean;
    language?: string;
    publication_year?: number;
    search?: string;
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<LibraryDocument>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<LibraryDocument>>(`/documents/${query ? `?${query}` : ''}`);
  }

  async getDocument(slug: string): Promise<LibraryDocumentDetail> {
    return this.request<LibraryDocumentDetail>(`/documents/${slug}/`);
  }

  async getFeaturedDocuments(): Promise<LibraryDocument[]> {
    return this.request<LibraryDocument[]>('/documents/featured/');
  }

  async getPopularDocuments(): Promise<LibraryDocument[]> {
    return this.request<LibraryDocument[]>('/documents/popular/');
  }

  async getRecentDocuments(): Promise<LibraryDocument[]> {
    return this.request<LibraryDocument[]>('/documents/recent/');
  }

  async getMostDownloadedDocuments(): Promise<LibraryDocument[]> {
    return this.request<LibraryDocument[]>('/documents/most_downloaded/');
  }

  async searchDocuments(params: {
    q?: string;
    document_type?: number;
    access_level?: string;
    language?: string;
    publication_year?: number;
    page?: number;
  }): Promise<PaginatedResponse<LibraryDocument>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    return this.request<PaginatedResponse<LibraryDocument>>(`/documents/search/?${searchParams.toString()}`);
  }

  async createDocument(formData: FormData): Promise<LibraryDocument> {
    const url = `${API_BASE_URL}/documents/`;
    
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
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in to upload documents');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async downloadDocument(slug: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/documents/${slug}/download/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Download failed');
    }
    
    return response.blob();
  }

  // Authors
  async getAuthors(params?: {
    search?: string;
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<Author>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Author>>(`/authors/${query ? `?${query}` : ''}`);
  }

  async getAuthor(slug: string): Promise<Author> {
    return this.request<Author>(`/authors/${slug}/`);
  }

  async createAuthor(authorData: { name: string; bio?: string; birth_year?: number; death_year?: number; nationality?: string }): Promise<Author> {
    return this.request<Author>('/authors/', {
      method: 'POST',
      body: JSON.stringify(authorData),
    });
  }

  // Publishers
  async getPublishers(params?: {
    search?: string;
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<Publisher>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Publisher>>(`/publishers/${query ? `?${query}` : ''}`);
  }

  async getPublisher(slug: string): Promise<Publisher> {
    return this.request<Publisher>(`/publishers/${slug}/`);
  }

  async createPublisher(publisherData: { name: string; description?: string; website?: string; location?: string }): Promise<Publisher> {
    return this.request<Publisher>('/publishers/', {
      method: 'POST',
      body: JSON.stringify(publisherData),
    });
  }

  // Document Types
  async getDocumentTypes(): Promise<PaginatedResponse<DocumentType>> {
    return this.request<PaginatedResponse<DocumentType>>('/document-types/');
  }

  async createDocumentType(typeData: { name: string; description?: string }): Promise<DocumentType> {
    return this.request<DocumentType>('/document-types/', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  }

  // Subjects
  async getSubjects(params?: {
    search?: string;
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<Subject>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Subject>>(`/subjects/${query ? `?${query}` : ''}`);
  }

  async getSubject(slug: string): Promise<Subject> {
    return this.request<Subject>(`/subjects/${slug}/`);
  }

  async createSubject(subjectData: { name: string; description?: string }): Promise<Subject> {
    return this.request<Subject>('/subjects/', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  // Collections
  async getCollections(params?: {
    collection_type?: string;
    is_featured?: boolean;
    search?: string;
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<LibraryCollection>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<LibraryCollection>>(`/collections/${query ? `?${query}` : ''}`);
  }

  async getCollection(slug: string): Promise<LibraryCollectionDetail> {
    return this.request<LibraryCollectionDetail>(`/collections/${slug}/`);
  }

  async getFeaturedCollections(): Promise<LibraryCollection[]> {
    return this.request<LibraryCollection[]>('/collections/featured/');
  }

  // Reading Lists
  async getReadingLists(params?: {
    search?: string;
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<ReadingList>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<ReadingList>>(`/reading-lists/${query ? `?${query}` : ''}`);
  }

  async getReadingList(slug: string): Promise<ReadingListDetail> {
    return this.request<ReadingListDetail>(`/reading-lists/${slug}/`);
  }

  async createReadingList(listData: { name: string; description?: string; is_public?: boolean }): Promise<ReadingList> {
    return this.request<ReadingList>('/reading-lists/', {
      method: 'POST',
      body: JSON.stringify(listData),
    });
  }

  async addDocumentToReadingList(listSlug: string, documentId: number): Promise<void> {
    return this.request<void>(`/reading-lists/${listSlug}/add_document/`, {
      method: 'POST',
      body: JSON.stringify({ document_id: documentId }),
    });
  }

  async removeDocumentFromReadingList(listSlug: string, documentId: number): Promise<void> {
    return this.request<void>(`/reading-lists/${listSlug}/remove_document/`, {
      method: 'DELETE',
      body: JSON.stringify({ document_id: documentId }),
    });
  }

  // Reviews
  async getReviews(params?: {
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<DocumentReview>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    return this.request<PaginatedResponse<DocumentReview>>(`/reviews/${query ? `?${query}` : ''}`);
  }

  async createReview(reviewData: { document: number; rating: number; title: string; content: string }): Promise<DocumentReview> {
    return this.request<DocumentReview>('/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }
}

export const libraryApiService = new LibraryApiService();
