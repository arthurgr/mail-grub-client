import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import EditPackagingModal from './EditPackagingModal';

export default function PackagingList() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [editing, setEditing] = useState(null);
  const size = 20;
  const queryClient = useQueryClient();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { data, isLoading } = useQuery({
    queryKey: ['packaging', page, search],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/packaging`, {
          params: { page, size, packagingMaterials: search },
        })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`${API_BASE_URL}/packaging/delete/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['packaging']),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchInput('');
    setPage(0);
  };

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
          Search
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Materials
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Avg Cost
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Quantity
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Cost / Unit
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Procurement
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.content?.map((item: any) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 border dark:border-gray-700">
                  {item.packagingMaterials}
                </td>
                <td className="px-4 py-2 border dark:border-gray-700">
                  ${item.averageCost}
                </td>
                <td className="px-4 py-2 border dark:border-gray-700">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 border dark:border-gray-700">
                  ${item.costPerUnit}
                </td>
                <td className="px-4 py-2 border dark:border-gray-700">
                  {item.procurement}
                </td>
                <td className="px-4 py-2 border dark:border-gray-700">
                  <button
                    onClick={() => setEditing(item)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between text-sm">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className={`px-4 py-2 rounded ${page === 0 ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {data?.meta?.page + 1} of {data?.meta?.totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={data?.meta?.last}
          className={`px-4 py-2 rounded ${data?.meta?.last ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {editing && (
          <motion.div
            key="edit-packaging"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EditPackagingModal
              packaging={editing}
              onClose={() => setEditing(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
