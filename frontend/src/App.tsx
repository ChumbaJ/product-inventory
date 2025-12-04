import { CreateModalContextProvider } from "./features/CreateProduct";
import { DeleteModalContextProvider } from "./features/DeleteProduct/model/DeleteProductModalContext";
import { EditModalContextProvider } from "./features/EditProduct";
import { MainPage } from "./pages/Main";
import { ProductRefetchProvider } from "./pages/Main/model/refetchProductsContext";

function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ProductRefetchProvider>
        <CreateModalContextProvider>
          <EditModalContextProvider>
            <DeleteModalContextProvider>
              <MainPage />
            </DeleteModalContextProvider>
          </EditModalContextProvider>
        </CreateModalContextProvider>
      </ProductRefetchProvider>
    </div>
  );
}

export default App;
