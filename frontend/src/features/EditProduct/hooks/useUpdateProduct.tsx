import { useCallback, useState } from "react";
import type { Product } from "../../../entities/Product/types/product.type";
import {
  useProductsRefetch
} from "../../../pages/Main/model/refetchProductsContext";
import { updateProduct } from "../api/updateProduct";

interface UseUpdateProductResponse {
  loading: boolean;
  error: string | null;
  data: Product | null;
  updateProductMutation: (product: Product) => Promise<Error | null>;
}

export const useUpdateProduct = (): UseUpdateProductResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Product | null>(null);
  const { refetch } = useProductsRefetch();

  const updateProductMutation = useCallback(async (product: Product) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await updateProduct(product);
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
  }, []);

  return { loading, error, data, updateProductMutation };
};
