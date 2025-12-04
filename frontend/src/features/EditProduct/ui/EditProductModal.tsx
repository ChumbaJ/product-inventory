import { useEffect, useState } from "react";
import Modal from "../../../shared/ui/Modal/Modal";
import { useEditModalContext } from "../model/EditProductModalContext";
import { validateProduct } from "../lib/validateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import type { Product } from "../../../entities/Product/types/product.type";

export const EditProductModal = () => {
  const { isEditModalOpen, setIsEditModalOpen, product } =
    useEditModalContext();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    article: product?.article || "",
    price: product?.price || 0,
    quantity: product?.quantity || 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string } | null>({});

  const { updateProductMutation, error } = useUpdateProduct();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!product?.id) return;

    const productData: Product = {
      id: product.id,
      name: formData.name,
      article: formData.article,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    const validationErrors = validateProduct(productData);

    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {} as { [key: string]: string });

      setErrors(errorMap);
      return;
    }

    const error = await updateProductMutation(productData);
    if (error) {
      return;
    }

    setIsEditModalOpen(false);
    setErrors(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setErrors(null);
  };

  useEffect(() => {
    if (!product) return;

    const updateFormData = () => {
      setFormData({
        name: product.name,
        article: product.article,
        price: product.price,
        quantity: product.quantity,
      });
    };

    updateFormData();
  }, [product]);

  return (
    <Modal
      title="Редактировать продукт"
      isOpen={isEditModalOpen}
      onClose={handleCloseModal}
    >
      {error && <p className="text-red-500">{error}</p>}
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
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
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
            name="article"
            type="text"
            value={formData.article}
            onChange={handleChange}
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
            name="price"
            type="number"
            value={formData.price === 0 ? "" : formData.price}
            onChange={handleChange}
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
            name="quantity"
            type="number"
            value={formData.quantity === 0 ? "" : formData.quantity}
            onChange={handleChange}
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
            Сохранить
          </button>
        </div>
      </form>
    </Modal>
  );
};
