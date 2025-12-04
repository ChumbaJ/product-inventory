import { createContext, useContext, useState } from "react";
import type { Product } from "../../../entities/Product/types/product.type";

interface EditModalContextInterface {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;

  product: Product | null;
  setProduct: (val: Product) => void;
}

const EditModalContext = createContext<EditModalContextInterface>({
  isEditModalOpen: false,
  setIsEditModalOpen: () => {},
  product: null,
  setProduct: () => {},
});

export const EditModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <EditModalContext.Provider
      value={{ isEditModalOpen, setIsEditModalOpen, product, setProduct }}
    >
      {children}
    </EditModalContext.Provider>
  );
};

export const useEditModalContext = () => {
  const context = useContext(EditModalContext);
  if (!context) {
    throw new Error(
      "useEditModalContext must be used within a EditModalContextProvider"
    );
  }
  return context;
};

export default EditModalContext;
