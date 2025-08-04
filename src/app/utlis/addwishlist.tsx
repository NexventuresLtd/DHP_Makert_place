// app/utlis/addwishlist.ts
import mainAxios from "../../comps/Instance/mainAxios";

interface WishlistItem {
  id: number;
  product: number;
  user: number;
  created_at: string;
}

// Toggle product in wishlist
export async function toggleProductInWishlist(product_id: number): Promise<{
  status: boolean;
  message: string;
  is_wishlisted?: boolean;
}> {
  try {
    const response = await mainAxios.post(
      "/market/wishlist/toggle_product/",
      { product_id }
    );
    return {
      status: true,
      message: "Wishlist updated successfully",
      is_wishlisted: response.data.is_wishlisted
    };
  } catch (error) {
    console.error("Failed to toggle product in wishlist:", error);
    return {
      status: false,
      message: "Failed to update wishlist"
    };
  }
}

// Check if product is in wishlist
export async function checkWishlistStatus(product_id: number): Promise<boolean> {
  try {
    const response = await mainAxios.get<WishlistItem[]>(`/market/wishlist/${product_id}/`);
    // Assuming the endpoint returns an array of wishlist items
    // If the array has any items, the product is in the wishlist
    return response.data.length > 0;
  } catch (error) {
    console.error("Failed to check wishlist status:", error);
    return false;
  }
}

// Get all wishlist items (optional)
export async function getWishlistItems(): Promise<WishlistItem[]> {
  try {
    const response = await mainAxios.get<WishlistItem[]>("/market/wishlist/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch wishlist items:", error);
    return [];
  }
}