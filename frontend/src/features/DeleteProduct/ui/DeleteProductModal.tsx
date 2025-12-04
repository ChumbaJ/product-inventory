import Modal from "../../../shared/ui/Modal/Modal";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useDeleteModalContext } from "../model/DeleteProductModalContext";

export const DeleteProductModal = () => {
  const { isDeleteModalOpen, setIsDeleteModalOpen, productId, setProductId } =
    useDeleteModalContext();
  const { deleteProductMutation } = useDeleteProduct();

  const onCancel = () => setIsDeleteModalOpen(false);

  const onConfirm = async () => {
    const error = await deleteProductMutation(productId);
    setProductId("");
    if (error) {
      return;
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <Modal
      title="Удалить продукт"
      isOpen={isDeleteModalOpen}
      onClose={onCancel}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Вы уверены, что хотите удалить этот элемент?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 border border-gray-300 py-2 px-4 rounded-md"
          >
            Отменить
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </Modal>
  );
};
