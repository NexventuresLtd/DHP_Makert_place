import mainAxios from "../../comps/Instance/mainAxios";

interface ProductFilterOptions {
  category?: string;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export async function fetchFilteredProducts(filters: ProductFilterOptions = {}) {
  try {
    const params: Record<string, any> = {};

    if (filters.category) params.category = filters.category;
    if (filters.is_featured !== undefined) params.is_featured = filters.is_featured;
    if (filters.min_price !== undefined) params.min_price = filters.min_price;
    if (filters.max_price !== undefined) params.max_price = filters.max_price;
    if (filters.search) params.search = filters.search;

    const response = await mainAxios.get("/market/products/", { params });
    console.log(response.data)
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch filtered products:", error);
    throw error;
  }
}
