import { Icon } from "@iconify-icon/react";


const Pagination = ({
  currentPage,
  totalPages,
  total,
  loading,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 mt-4 px-4 py-3 border-t border-white/10 max-w-[649px] mx-auto">
    <button
      onClick={onPrev}
      disabled={currentPage <= 1 || loading}
      className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#002732] text-[#EFEFEF] text-sm font-semibold disabled:opacity-30 transition hover:bg-[#00273298]"
    >
      <Icon icon="tabler:arrow-left" className="text-base" />
      Prev
    </button>

    <span className="text-[#F5F5F7]/50 text-xs">
      Page {currentPage} of {totalPages}&nbsp;·&nbsp;{total} transactions
    </span>

    <button
      onClick={onNext}
      disabled={currentPage >= totalPages || loading}
      className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#002732] text-[#EFEFEF] text-sm font-semibold disabled:opacity-30 transition hover:bg-[#00273298]"
    >
      Next
      <Icon icon="tabler:arrow-right" className="text-base" />
    </button>
  </div>
);

export default Pagination