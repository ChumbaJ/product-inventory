import { useCallback, useState } from "react";
import type { Product } from "../../../entities/Product/types/product.type";
import { useProductsRefetch } from "../../../pages/Main/model/refetchProductsContext";
import type { CreateProductDto } from "../../../shared/api/dto/createProductDto";
import { createProduct } from "../api/createProduct";

interface UseCreateProductResponse {
  loading: boolean;
  error: string | null;
  data: Product | null;
  createProductMutation: (
    newProduct: CreateProductDto
  ) => Promise<Error | null>;
}

export const useCreateProduct = (): UseCreateProductResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Product | null>(null);
  const { refetch } = useProductsRefetch();

  const createProductMutation = useCallback(
    async (newProduct: CreateProductDto) => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await createProduct(newProduct);
        setData(response.data);
        refetch();

        return null;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          throw error;
        } else {
          setError("Unknown error occurred");
          throw error;
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, data, createProductMutation };
};
