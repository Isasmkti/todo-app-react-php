type Props = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="pagination">
      <button type="button" onClick={onPrev} disabled={currentPage <= 1}>
        Prev
      </button>

      <span>
        Halaman {currentPage} dari {totalPages}
      </span>

      <button type="button" onClick={onNext} disabled={currentPage >= totalPages}>
        Next
      </button>
    </div>
  );
}
