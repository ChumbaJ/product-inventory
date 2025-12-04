import { useEffect, useState } from "react";
import type { Product } from "../../../entities/Product/types/product.type";
import { getProducts } from "../api/getProducts";
import { useProductsRefetch } from "../model/refetchProductsContext";

interface UseProductsResponse {
  loading: boolean;
  error: string | null;
  data: Product[] | null;
  count: number;
}

interface UseProductsArgs {
  page: number;
  limit: number;
}

export const useGetProducts = ({
  page,
  limit,
}: UseProductsArgs): UseProductsResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Product[] | null>(null);
  const [count, setCount] = useState(0);
  const { trigger } = useProductsRefetch();

  useEffect(() => {
    const doRequest = async () => {
      try {
        const data = await getProducts({ page, limit });
        setData(data.data);
        setCount(data.count);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    doRequest();
  }, [page, limit, trigger]);

  return { loading, error, data, count };
};
