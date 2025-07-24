//

import mainAxios from "../comps/Instance/mainAxios";

export async function addItemToCart(product_id: number, quantity: number): Promise<{status: boolean, message: string}> {
  try {
    const response = await mainAxios.post(
      "/market/cart/add_item/",
      {
        product_id,
        quantity
      },
    );
    console.log("Item added to cart:", response.data);
    return {"status": true, "message": "Item added to cart successfully"};
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    // Optionally: throw or handle error in UI
    return {"status": false, "message": "Failed to add item to cart"};
  }
}
