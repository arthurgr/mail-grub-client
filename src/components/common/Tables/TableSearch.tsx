import React from 'react';

interface TableSearchProps {
  search: string;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

export default function TableSearch({
  search,
  searchInput,
  onSearchInputChange,
  onSubmit,
  onClear,
}: TableSearchProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
        Search
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          placeholder="..."
          className="border p-2 rounded w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
