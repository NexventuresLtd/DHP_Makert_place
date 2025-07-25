import mainAxios from "../../comps/Instance/mainAxios";

interface ProductFilterOptions {
  category?: string;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
}

// Helper to generate a unique cache key based on filters
function getCacheKey(filters: ProductFilterOptions): string {
  return `filteredProducts_${JSON.stringify(filters)}`;
}

const CACHE_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours

export async function fetchFilteredProducts(filters: ProductFilterOptions = {}) {
  const cacheKey = getCacheKey(filters);
  const cachedDataString = localStorage.getItem(cacheKey);

  if (cachedDataString) {
    const { timestamp, data } = JSON.parse(cachedDataString);
    const now = Date.now();

    if (now - timestamp < CACHE_DURATION_MS) {
      console.log("Using cached data");
      return data;
    }
  }

  try {
    const params: Record<string, any> = {};

    if (filters.category) params.category = filters.category;
    if (filters.is_featured !== undefined) params.is_featured = filters.is_featured;
    if (filters.min_price !== undefined) params.min_price = filters.min_price;
    if (filters.max_price !== undefined) params.max_price = filters.max_price;
    if (filters.search) params.search = filters.search;

    const response = await mainAxios.get("/market/products/", { params });

    // Cache the new data with current timestamp
    const newCache = {
      timestamp: Date.now(),
      data: response.data,
    };
    localStorage.setItem(cacheKey, JSON.stringify(newCache));

    return response.data;
  } catch (error) {
    console.error("Failed to fetch filtered products:", error);
    throw error;
  }
}
