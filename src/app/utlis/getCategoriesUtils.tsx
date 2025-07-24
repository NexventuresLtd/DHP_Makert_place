import mainAxios from "../../comps/Instance/mainAxios";
import type { Category } from "../../types/marketTypes";




export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await mainAxios.get("/market/categories/", {
      headers: {
        Accept: "application/json",
      },
    });

    return response.data as Category[];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}
