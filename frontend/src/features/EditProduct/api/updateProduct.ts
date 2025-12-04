import type { Product } from "../../../entities/Product/types/product.type";
import { api } from "../../../shared/api/api";

export const updateProduct = async (product: Product) => {
  return await api.updateProduct({ id: product.id, updatedProduct: product });
};
