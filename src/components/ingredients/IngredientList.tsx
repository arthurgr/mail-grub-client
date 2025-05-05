import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EditIngredientModal from './EditIngredientModal';

export default function IngredientList() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [editing, setEditing] = useState(null);

  const size = 5;
  const queryClient = useQueryClient();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { data, isLoading } = useQuery({
    queryKey: ['ingredients', page, search],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/ingredients`, {
          params: { page, size, name: search },
        })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`${API_BASE_URL}/ingredients/delete/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['ingredients']),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  if (isLoading)
    return <div className="text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search ingredients..."
          className="border p-2 rounded w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Measurement
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Purchase Size
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Avg Cost
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Cost/Oz
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.content?.map((i: any) => (
              <tr
                key={i.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  {i.name}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  {i.measurementType}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  {i.purchaseSize}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  ${i.averageCost}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  ${i.costPerOunce}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  <button
                    onClick={() => setEditing(i)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(i.id)}
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

      <div className="flex justify-between items-center text-sm">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
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
          Page {data?.meta?.page + 1} of {data?.meta?.totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={data?.meta?.last}
          className={`px-4 py-2 rounded ${
            data?.meta?.last
              ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
      {editing && (
        <EditIngredientModal
          ingredient={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
