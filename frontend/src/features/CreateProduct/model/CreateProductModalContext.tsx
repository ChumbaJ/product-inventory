import { createContext, useContext, useState } from "react";

interface CreateModalContextInterface {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (val: boolean) => void;
}

const CreateModalContext = createContext<CreateModalContextInterface>({
  isCreateModalOpen: false,
  setIsCreateModalOpen: () => {},
});

export const CreateModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  return (
    <CreateModalContext.Provider value={{ isCreateModalOpen, setIsCreateModalOpen }}>
      {children}
    </CreateModalContext.Provider>
  );
};

export const useCreateModalContext = () => {
  const context = useContext(CreateModalContext);
  if (!context) {
    throw new Error(
      "useCreateModalContext must be used within a CreateModalContextProvider"
    );
  }
  return context;
};

export default CreateModalContext;
