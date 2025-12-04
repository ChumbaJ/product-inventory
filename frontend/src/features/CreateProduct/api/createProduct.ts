import { api } from "../../../shared/api/api";
import type { CreateProductDto } from "../../../shared/api/dto/createProductDto";

export const createProduct = async (product: CreateProductDto) => {
  return await api.createProduct(product);
};
