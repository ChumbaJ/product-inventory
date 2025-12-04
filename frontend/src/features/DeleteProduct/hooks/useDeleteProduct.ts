import { useCallback, useState } from "react";
import { deleteProduct } from "../api/deleteProduct";
import { useProductsRefetch } from "../../../pages/Main/model/refetchProductsContext";

interface UseCreateProductResponse {
  loading: boolean;
  error: string | null;
  data: { id: number } | null;
  deleteProductMutation: (id: number | string) => Promise<Error | null>;
}

export const useDeleteProduct = (): UseCreateProductResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ id: number } | null>(null);
  const { refetch } = useProductsRefetch();

  const deleteProductMutation = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await deleteProduct(id);
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

  return { loading, error, data, deleteProductMutation };
};
