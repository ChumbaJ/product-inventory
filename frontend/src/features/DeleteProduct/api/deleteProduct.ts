import { api } from "../../../shared/api/api";

export const deleteProduct = async (id: string | number) => {
  return await api.deleteProduct(Number(id));
};
