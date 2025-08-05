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

  async getMuseum(slug: string): Promise<Museum> {
    const response = await apiClient.get<Museum>(`/museums/${slug}/`);
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
  getExhibitions,
  getExhibition,
  getCurrentExhibitions,
  getUpcomingExhibitions,
  getReviews,
  createReview,
  markReviewHelpful,
  getCollections,
  getCollection,
} = museumService;
