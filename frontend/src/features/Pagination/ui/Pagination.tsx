import { Button } from "../../../shared/ui/Button/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        type="outline"
        onClick={handlePrev}
        className="text-blue-500 hover:text-blue-700"
      >
        Назад
      </Button>
      <span className="text-gray-700">
        Страница {currentPage} из {totalPages}
      </span>
      <Button
        type="outline"
        onClick={handleNext}
        className="text-blue-500 hover:text-blue-700"
      >
        Вперед
      </Button>
    </div>
  );
};
