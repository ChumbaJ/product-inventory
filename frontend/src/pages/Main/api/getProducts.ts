import { api, type GetProductsArgs } from "../../../shared/api/api";

export const getProducts = async ({ page, limit }: GetProductsArgs) => {
  return api.getProducts({ page, limit });
};
