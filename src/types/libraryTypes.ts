export interface Author {
  id: number;
  name: string;
  slug: string;
  bio: string;
  birth_year?: number;
  death_year?: number;
  nationality: string;
  document_count: number;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
  description: string;
  website?: string;
  location: string;
  document_count: number;
}

export interface DocumentType {
  id: number;
  name: string;
  slug: string;
  description: string;
  document_count: number;
}

export interface Subject {
  id: number;
  name: string;
  slug: string;
  description: string;
  document_count: number;
}

export interface LibraryDocument {
  id: number;
  title: string;
  slug: string;
  authors_display: string;
  document_type_name: string;
  publisher_name: string;
  publication_year?: number;
  isbn?: string;
  doi?: string;
  abstract: string;
  language: string;
  pages?: number;
  file?: string;
  cover_image?: string;
  access_level: 'public' | 'restricted' | 'private';
  subjects_list: string[];
  uploaded_by_name: string;
  created_at: string;
  is_featured: boolean;
  view_count: number;
  download_count: number;
  file_size?: number;
}

export interface LibraryDocumentDetail extends LibraryDocument {
  authors: Author[];
  document_type: DocumentType;
  publisher: Publisher;
  subjects: Subject[];
  reviews?: DocumentReview[];
}

export interface LibraryCollection {
  id: number;
  name: string;
  slug: string;
  collection_type: 'curated' | 'series' | 'conference' | 'journal' | 'special';
  description: string;
  curator_name: string;
  document_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface LibraryCollectionDetail extends LibraryCollection {
  documents: LibraryDocument[];
}

export interface ReadingList {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_by_name: string;
  document_count: number;
  is_public: boolean;
  created_at: string;
}

export interface ReadingListDetail extends ReadingList {
  documents: LibraryDocument[];
}

export interface DocumentReview {
  id: number;
  document: number;
  reviewer_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  is_verified: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
