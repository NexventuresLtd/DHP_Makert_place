export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    artwork_count: number;
  }
  
  export interface Collection {
    id: number;
    name: string;
    slug: string;
    collection_type: string;
    description: string;
    curator_name: string;
    artwork_count: number;
    is_featured: boolean;
    created_at: string;
  }
  
  export interface Artwork {
    id: number;
    title: string;
    slug: string;
    artist_display: string;
    category_name: string;
    collection_name: string;
    artwork_type: string;
    description: string;
    image: string;
    thumbnail: string;
    year_created?: number;
    medium?: string;
    dimensions?: string;
    location?: string;
    tags_list: string[];
    cultural_significance?: string;
    uploaded_by_name: string;
    created_at: string;
    is_featured: boolean;
    view_count: number;
  }
  
  export interface Artist {
    id: number;
    name: string;
    slug: string;
    bio: string;
    birth_year?: number;
    death_year?: number;
    nationality: string;
    artwork_count: number;
  }
  
  export interface Exhibition {
    id: number;
    title: string;
    slug: string;
    description: string;
    curator_name: string;
    start_date: string;
    end_date: string;
    location: string;
    is_virtual: boolean;
    poster_image?: string;
    artwork_count: number;
    is_active: boolean;
  }
  
  export interface PaginatedResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
  }
  