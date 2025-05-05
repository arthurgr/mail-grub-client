import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EditRecipeModal from './EditRecipeModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RecipeList() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<null | any>(null);

  const queryClient = useQueryClient();
  const size = 5;

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', page, search],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/recipes`, {
          params: { page, size, name: search },
        })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`${API_BASE_URL}/recipes/delete/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  if (isLoading)
    return (
      <div className="text-gray-600 dark:text-gray-300">Loading recipes...</div>
    );

  return (
    <div className="space-y-4 mt-8">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search recipes..."
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
                Items Made
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Ingredients
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Total Cost
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Cost per Item
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.content?.map((r: any) => (
              <tr
                key={r.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  {r.name}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  {r.itemsMade}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  {r.ingredients
                    .map((ing: any) => `${ing.name} (${ing.amount})`)
                    .join(', ')}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  ${r.totalCost}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  ${r.costPerItem}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  <button
                    onClick={() => setEditing(r)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(r.id)}
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
        <EditRecipeModal recipe={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
