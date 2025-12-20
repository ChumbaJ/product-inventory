import { useState } from "react";
import type { Product } from "../../../entities/Product/types/product.type";
import {
  CreateProductModal,
  useCreateModalContext,
} from "../../../features/CreateProduct";
import { DeleteProductModal } from "../../../features/DeleteProduct";
import { useDeleteModalContext } from "../../../features/DeleteProduct/model/DeleteProductModalContext";
import {
  EditProductModal,
  useEditModalContext,
} from "../../../features/EditProduct";
import { Pagination } from "../../../features/Pagination/ui/Pagination";
import { config } from "../../../shared/config";
import { Button } from "../../../shared/ui/Button/Button";
import Table, { type TableColumn } from "../../../shared/ui/Table/Table";
import { useGetProducts } from "../hooks/useGetProducts";

const columns: TableColumn<Product>[] = [
  { header: "ID", accessor: "id" },
  { header: "Название", accessor: "name" },
  { header: "Артикул", accessor: "article" },
  { header: "Цена", accessor: "price" },
  { header: "Количество", accessor: "quantity" },
];

export const MainPage = () => {
  const { setIsCreateModalOpen } = useCreateModalContext();
  const { setIsEditModalOpen, setProduct } = useEditModalContext();
  const { setIsDeleteModalOpen, setProductId } = useDeleteModalContext();
  const [page, setPage] = useState(1);
  const { data, count, loading, error } = useGetProducts({
    page,
    limit: config.limit,
  });

  const handleCreateProduct = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditProduct = (row: Product) => {
    setIsEditModalOpen(true);
    setProduct(row);
  };

  const handleDeleteProduct = (row: Product) => {
    setIsDeleteModalOpen(true);
    setProductId(row.id);
  };

  const handlePaginate = (page: number) => {
    setPage(page);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex items-center justify-center mb-4">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Список Продуктов MY APP
        </h1>
        <Button
          onClick={handleCreateProduct}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Создать продукт
        </Button>
      </div>

      <div>
        <Pagination
          currentPage={page}
          totalPages={count}
          onPageChange={handlePaginate}
        />
      </div>

      <div className="flex flex-col">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Table
            columns={columns}
            data={data ?? []}
            actions={(row) => (
              <>
                <Button onClick={() => handleEditProduct(row)} type="filled">
                  Редактировать
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(row)}
                  type="outline"
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </Button>
              </>
            )}
          />
        )}
      </div>

      <CreateProductModal />
      <EditProductModal />
      <DeleteProductModal />
    </div>
  );
};
