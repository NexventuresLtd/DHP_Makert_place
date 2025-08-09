import axios from 'axios';

// Base URL for the API - adjust this based on your Django server configuration
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/digital-repo`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to include fresh auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Types based on the Django models
export interface MuseumCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  museum_count: number;
  created_at: string;
}

export interface Museum {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  location: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  category: number;
  category_name: string;
  category_slug: string;
  tags: string;
  tags_list: string[];
  main_image: string;
  gallery_images: string[];
  virtual_tour_url: string;
  video_url: string;
  status: string;
  opening_hours: Record<string, string>;
  admission_fee: string;
  admission_info: string;
  has_parking: boolean;
  has_wifi: boolean;
  has_restaurant: boolean;
  has_gift_shop: boolean;
  is_wheelchair_accessible: boolean;
  has_guided_tours: boolean;
  established_year: number;
  visitor_count: number;
  view_count: number;
  rating: string;
  average_rating: string;
  review_count: number;
  is_featured: boolean;
  curator: number;
  curator_name: string;
  exhibition_count: number;
  created_at: string;
  updated_at: string;
}

export interface MuseumExhibition {
  id: number;
  title: string;
  slug: string;
  description: string;
  exhibition_type: string;
  exhibition_type_display: string;
  museum: number;
  museum_name: string;
  museum_slug: string;
  start_date: string;
  end_date: string;
  poster_image: string;
  gallery_images: string[];
  curator_notes: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MuseumReview {
  id: number;
  museum: number;
  museum_name: string;
  user: number;
  user_name: string;
  rating: number;
  title: string;
  review_text: string;
  visit_date: string;
  is_verified: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface MuseumCollection {
  id: number;
  name: string;
  slug: string;
  description: string;
  museums: Museum[];
  cover_image: string;
  is_featured: boolean;
  curator: number;
  curator_name: string;
  museum_count: number;
  created_at: string;
  updated_at: string;
}

// New interfaces for museum content
export interface MuseumSection {
  id: number;
  museum: number;
  section_type: string;
  title: string;
  content: string[];
  subsections: any[];
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MuseumGalleryItem {
  id: number;
  museum: number;
  title: string;
  description: string;
  image: string;
  image_url: string;
  order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MuseumArtifact {
  id: number;
  museum: number;
  name: string;
  description: string;
  category: string;
  category_display: string;
  historical_period: string;
  origin: string;
  materials: string;
  dimensions: string;
  image: string;
  image_url: string;
  is_on_display: boolean;
  acquisition_date: string;
  acquisition_method: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface MuseumVirtualExhibition {
  id: number;
  museum: number;
  title: string;
  description: string;
  exhibition_type: string;
  exhibition_type_display: string;
  url: string;
  thumbnail_image: string;
  thumbnail_url: string;
  duration: string;
  is_featured: boolean;
  is_active: boolean;
  requires_registration: boolean;
  access_instructions: string;
  technical_requirements: string;
  order: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface MuseumInfo {
  id: number;
  museum: number;
  hours: string;
  contact: string;
  admission: string;
  facilities: string[];
  directions: string;
  parking_info: string;
  accessibility_info: string;
  group_booking_info: string;
  special_programs: string[];
  created_at: string;
  updated_at: string;
}

// Enhanced Museum interface with all content
export interface MuseumWithContent extends Museum {
  sections: MuseumSection[];
  gallery_items: MuseumGalleryItem[];
  artifacts: MuseumArtifact[];
  virtual_exhibitions: MuseumVirtualExhibition[];
  additional_info: MuseumInfo;
}

// API Response types
export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Museum Service Class
class MuseumService {
  // Museum Categories
  async getCategories(): Promise<MuseumCategory[]> {
    const response = await apiClient.get<MuseumCategory[]>('/museums/categories/');
    return response.data;
  }

  async getCategory(slug: string): Promise<MuseumCategory> {
    const response = await apiClient.get<MuseumCategory>(`/museums/categories/${slug}/`);
    return response.data;
  }

  // Museums
  async getMuseums(params?: {
    category?: string;
    location?: string;
    city?: string;
    is_featured?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<ApiResponse<Museum>> {
    const response = await apiClient.get<ApiResponse<Museum>>('/museums/', { params });
    return response.data;
  }

  async getMuseum(slug: string): Promise<MuseumWithContent> {
    const response = await apiClient.get<MuseumWithContent>(`/museums/${slug}/`);
    return response.data;
  }

  async getFeaturedMuseums(): Promise<Museum[]> {
    const response = await apiClient.get<Museum[]>('/museums/featured/');
    return response.data;
  }

  async getMuseumsByCategory(): Promise<{ category: MuseumCategory; museums: Museum[] }[]> {
    const response = await apiClient.get<{ category: MuseumCategory; museums: Museum[] }[]>('/museums/by_category/');
    return response.data;
  }

  async getPopularMuseums(): Promise<Museum[]> {
    const response = await apiClient.get<Museum[]>('/museums/popular/');
    return response.data;
  }

  async getRecentMuseums(): Promise<Museum[]> {
    const response = await apiClient.get<Museum[]>('/museums/recent/');
    return response.data;
  }

  async recordVisit(slug: string): Promise<void> {
    await apiClient.post(`/museums/${slug}/visit/`);
  }

  // Museum CRUD operations for admin
  async createMuseum(museumData: FormData | Partial<Museum>): Promise<Museum> {
    const config = museumData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await apiClient.post<Museum>('/museums/', museumData, config);
    return response.data;
  }

  async updateMuseum(slug: string, museumData: FormData | Partial<Museum>): Promise<Museum> {
    const config = museumData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await apiClient.put<Museum>(`/museums/${slug}/`, museumData, config);
    return response.data;
  }

  async deleteMuseum(slug: string): Promise<void> {
    await apiClient.delete(`/museums/${slug}/`);
  }

  // Museum Exhibitions
  async getExhibitions(params?: {
    museum?: string;
    exhibition_type?: string;
    is_featured?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<ApiResponse<MuseumExhibition>> {
    const response = await apiClient.get<ApiResponse<MuseumExhibition>>('/museums/exhibitions/', { params });
    return response.data;
  }

  async getExhibition(slug: string): Promise<MuseumExhibition> {
    const response = await apiClient.get<MuseumExhibition>(`/museums/exhibitions/${slug}/`);
    return response.data;
  }

  async getCurrentExhibitions(): Promise<MuseumExhibition[]> {
    const response = await apiClient.get<MuseumExhibition[]>('/museums/exhibitions/current/');
    return response.data;
  }

  async getUpcomingExhibitions(): Promise<MuseumExhibition[]> {
    const response = await apiClient.get<MuseumExhibition[]>('/museums/exhibitions/upcoming/');
    return response.data;
  }

  // Museum Reviews
  async getReviews(params?: {
    museum?: string;
    rating?: number;
    is_verified?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<ApiResponse<MuseumReview>> {
    const response = await apiClient.get<ApiResponse<MuseumReview>>('/museums/reviews/', { params });
    return response.data;
  }

  async createReview(reviewData: {
    museum: number;
    rating: number;
    title?: string;
    review_text?: string;
    visit_date?: string;
  }): Promise<MuseumReview> {
    const response = await apiClient.post<MuseumReview>('/museums/reviews/', reviewData);
    return response.data;
  }

  async markReviewHelpful(id: number): Promise<void> {
    await apiClient.post(`/museums/reviews/${id}/helpful/`);
  }

  // Museum Collections
  async getCollections(params?: {
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<ApiResponse<MuseumCollection>> {
    const response = await apiClient.get<ApiResponse<MuseumCollection>>('/museums/collections/', { params });
    return response.data;
  }

  async getCollection(slug: string): Promise<MuseumCollection> {
    const response = await apiClient.get<MuseumCollection>(`/museums/collections/${slug}/`);
    return response.data;
  }

  // Museum Content Management Methods
  async getMuseumSections(museumSlug: string): Promise<MuseumSection[]> {
    const response = await apiClient.get<MuseumSection[]>(`/museums/sections/?museum=${museumSlug}`);
    return response.data;
  }

  async createMuseumSection(sectionData: Partial<MuseumSection>): Promise<MuseumSection> {
    const response = await apiClient.post<MuseumSection>('/museums/sections/', sectionData);
    return response.data;
  }

  async updateMuseumSection(id: number, sectionData: Partial<MuseumSection>): Promise<MuseumSection> {
    const response = await apiClient.put<MuseumSection>(`/museums/sections/${id}/`, sectionData);
    return response.data;
  }

  async deleteMuseumSection(id: number): Promise<void> {
    await apiClient.delete(`/museums/sections/${id}/`);
  }

  async getMuseumGallery(museumSlug: string): Promise<MuseumGalleryItem[]> {
    const response = await apiClient.get<MuseumGalleryItem[]>(`/museums/gallery/?museum=${museumSlug}`);
    return response.data;
  }

  async createGalleryItem(galleryData: FormData | Partial<MuseumGalleryItem>): Promise<MuseumGalleryItem> {
    const config = galleryData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await apiClient.post<MuseumGalleryItem>('/museums/gallery/', galleryData, config);
    return response.data;
  }

  async updateGalleryItem(id: number, galleryData: FormData | Partial<MuseumGalleryItem>): Promise<MuseumGalleryItem> {
    const config = galleryData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await apiClient.put<MuseumGalleryItem>(`/museums/gallery/${id}/`, galleryData, config);
    return response.data;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await apiClient.delete(`/museums/gallery/${id}/`);
  }

  async getMuseumArtifacts(museumSlug: string): Promise<MuseumArtifact[]> {
    const response = await apiClient.get<MuseumArtifact[]>(`/museums/artifacts/?museum=${museumSlug}`);
    return response.data;
  }

  async createArtifact(artifactData: FormData | Partial<MuseumArtifact>): Promise<MuseumArtifact> {
    const config = artifactData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await apiClient.post<MuseumArtifact>('/museums/artifacts/', artifactData, config);
    return response.data;
  }

  async updateArtifact(id: number, artifactData: FormData | Partial<MuseumArtifact>): Promise<MuseumArtifact> {
    const config = artifactData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await apiClient.put<MuseumArtifact>(`/museums/artifacts/${id}/`, artifactData, config);
    return response.data;
  }

  async deleteArtifact(id: number): Promise<void> {
    await apiClient.delete(`/museums/artifacts/${id}/`);
  }

  async getMuseumVirtualExhibitions(museumSlug: string): Promise<MuseumVirtualExhibition[]> {
    const response = await apiClient.get<MuseumVirtualExhibition[]>(`/museums/virtual-exhibitions/?museum=${museumSlug}`);
    return response.data;
  }

  async createVirtualExhibition(exhibitionData: FormData | Partial<MuseumVirtualExhibition>): Promise<MuseumVirtualExhibition> {
    const config = exhibitionData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await apiClient.post<MuseumVirtualExhibition>('/museums/virtual-exhibitions/', exhibitionData, config);
    return response.data;
  }

  async updateVirtualExhibition(id: number, exhibitionData: FormData | Partial<MuseumVirtualExhibition>): Promise<MuseumVirtualExhibition> {
    const config = exhibitionData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await apiClient.put<MuseumVirtualExhibition>(`/museums/virtual-exhibitions/${id}/`, exhibitionData, config);
    return response.data;
  }

  async deleteVirtualExhibition(id: number): Promise<void> {
    await apiClient.delete(`/museums/virtual-exhibitions/${id}/`);
  }

  async accessVirtualExhibition(id: number): Promise<{ status: string; url: string }> {
    const response = await apiClient.post(`/museums/virtual-exhibitions/${id}/access/`);
    return response.data;
  }

  async getMuseumInfo(museumSlug: string): Promise<MuseumInfo | null> {
    try {
      const response = await apiClient.get<MuseumInfo>(`/museums/info/?museum=${museumSlug}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async createMuseumInfo(infoData: Partial<MuseumInfo>): Promise<MuseumInfo> {
    const response = await apiClient.post<MuseumInfo>('/museums/info/', infoData);
    return response.data;
  }

  async updateMuseumInfo(id: number, infoData: Partial<MuseumInfo>): Promise<MuseumInfo> {
    const response = await apiClient.put<MuseumInfo>(`/museums/info/${id}/`, infoData);
    return response.data;
  }
}

// Create and export a singleton instance
const museumService = new MuseumService();
export default museumService;

// Also export individual methods for easier importing
export const {
  getCategories,
  getCategory,
  getMuseums,
  getMuseum,
  getFeaturedMuseums,
  getMuseumsByCategory,
  getPopularMuseums,
  getRecentMuseums,
  recordVisit,
  createMuseum,
  updateMuseum,
  deleteMuseum,
  getExhibitions,
  getExhibition,
  getCurrentExhibitions,
  getUpcomingExhibitions,
  getReviews,
  createReview,
  markReviewHelpful,
  getCollections,
  getCollection,
  getMuseumSections,
  createMuseumSection,
  updateMuseumSection,
  deleteMuseumSection,
  getMuseumGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getMuseumArtifacts,
  createArtifact,
  updateArtifact,
  deleteArtifact,
  getMuseumVirtualExhibitions,
  createVirtualExhibition,
  updateVirtualExhibition,
  deleteVirtualExhibition,
  accessVirtualExhibition,
  getMuseumInfo,
  createMuseumInfo,
  updateMuseumInfo,
} = museumService;
