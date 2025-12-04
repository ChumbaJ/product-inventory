import { useState } from "react";
import Modal from "../../../shared/ui/Modal/Modal";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { validateCreateProduct } from "../lib/validateCreateProduct";
import { useCreateModalContext } from "../model/CreateProductModalContext";

interface Product {
  name: string;
  article: string;
  price: number;
  quantity: number;
}

export const CreateProductModal = () => {
  const [name, setName] = useState<string>("");
  const [article, setArticle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string } | null>({});

  const { isCreateModalOpen, setIsCreateModalOpen } = useCreateModalContext();
  const { createProductMutation, error: mutationError } = useCreateProduct();

  const handleSave = async () => {
    const productData: Product = { name, article, price, quantity };
    const validationErrors = validateCreateProduct(productData);

    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {} as { [key: string]: string });

      setErrors(errorMap);
      return;
    }

    const error = await createProductMutation(productData);
    if (error) {
      return;
    }

    setIsCreateModalOpen(false);
    setErrors(null);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setErrors(null);
  };

  return (
    <Modal
      title="Создать продукт"
      isOpen={isCreateModalOpen}
      onClose={handleCloseModal}
    >
      {mutationError && <p className="text-red-500">{mutationError}</p>}
      <form className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Название
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 p-2 w-full border ${
              errors?.name ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors?.name && (
            <p className="text-sm text-red-500">{errors?.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="article"
            className="block text-sm font-medium text-gray-700"
          >
            Артикул
          </label>
          <input
            id="article"
            type="text"
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            className={`mt-1 p-2 w-full border ${
              errors?.article ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors?.article && (
            <p className="text-sm text-red-500">{errors?.article}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Цена
          </label>
          <input
            id="price"
            type="number"
            value={price === 0 ? "" : price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className={`mt-1 p-2 w-full border ${
              errors?.price ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors?.price && (
            <p className="text-sm text-red-500">{errors?.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Количество
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={`mt-1 p-2 w-full border ${
              errors?.quantity ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors?.quantity && (
            <p className="text-sm text-red-500">{errors?.quantity}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700 border border-gray-300 py-2 px-4 rounded-md"
          >
            Отменить
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Создать
          </button>
        </div>
      </form>
    </Modal>
  );
};
