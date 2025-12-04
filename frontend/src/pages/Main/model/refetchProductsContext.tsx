import React, { createContext, useContext, useState } from "react";

interface RefetchContextType {
  refetch: () => void;
  trigger: number;
}

const RefetchContext = createContext<RefetchContextType | undefined>(undefined);

export const ProductRefetchProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [trigger, setTrigger] = useState(0);

  const refetch = () => {
    setTrigger((prev) => prev + 1);
  };

  return (
    <RefetchContext.Provider value={{ refetch, trigger }}>
      {children}
    </RefetchContext.Provider>
  );
};

export const useProductsRefetch = (): RefetchContextType => {
  const context = useContext(RefetchContext);
  if (!context) {
    throw new Error("useRefetch must be used within a RefetchProvider");
  }
  return context;
};
