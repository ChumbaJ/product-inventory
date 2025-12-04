import type { Product } from "../../../entities/Product/types/product.type";

interface ValidationError {
  field: string;
  message: string;
}

type validateProductArg = Omit<Product, "id">;

export const validateCreateProduct = (
  product: validateProductArg
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!product.name) {
    errors.push({ field: "name", message: "Название продукта обязательно." });
  }

  if (!product.article) {
    errors.push({ field: "article", message: "Артикул обязателен." });
  }

  if (product.price <= 0) {
    errors.push({ field: "price", message: "Цена должна быть больше нуля." });
  }

  if (product.quantity < 0) {
    errors.push({
      field: "quantity",
      message: "Количество не может быть отрицательным.",
    });
  }

  return errors;
};
