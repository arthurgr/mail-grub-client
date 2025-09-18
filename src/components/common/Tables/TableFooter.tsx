import React from 'react';

interface TableFooterProps {
  page: number;
  totalPages: number;
  isLastPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function TableFooter({
  page,
  totalPages,
  isLastPage,
  onPrevious,
  onNext,
}: TableFooterProps) {
  return (
    <div className="flex justify-between items-center text-sm">
      <button
        onClick={onPrevious}
        disabled={page === 0}
        className={`px-4 py-2 rounded ${
          page === 0
            ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-500'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Previous
      </button>
      <span className="text-gray-700 dark:text-gray-300">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={isLastPage}
        className={`px-4 py-2 rounded ${
          isLastPage
            ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-500'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Next
      </button>
    </div>
  );
}
