import { createContext, useContext, useState } from "react";

interface DeleteModalContextInterface {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (val: boolean) => void;

  productId: string | number;
  setProductId: (val: string | number) => void;
}

const DeleteModalContext = createContext<DeleteModalContextInterface>({
  isDeleteModalOpen: false,
  setIsDeleteModalOpen: () => {},

  productId: "",
  setProductId: () => {},
});

export const DeleteModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | number>(0);

  return (
    <DeleteModalContext.Provider
      value={{
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        productId,
        setProductId,
      }}
    >
      {children}
    </DeleteModalContext.Provider>
  );
};

export const useDeleteModalContext = () => {
  const context = useContext(DeleteModalContext);
  if (!context) {
    throw new Error(
      "useDeleteModalContext must be used within a DeleteModalContextProvider"
    );
  }
  return context;
};

export default DeleteModalContext;
