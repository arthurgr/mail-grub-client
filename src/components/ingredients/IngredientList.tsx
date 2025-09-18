import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import EditIngredientModal from './EditIngredientModal';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/client';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TrHead,
  TableContainer,
} from '../common/TableElements';

export default function IngredientList() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [editing, setEditing] = useState<any>(null);

  const size = 20;
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['ingredients', page, search, user?.uid],
    queryFn: async () => {
      const res = await api.get('/ingredients', {
        params: { page, size, name: search },
      });
      return res.data;
    },
    enabled: !!user,
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/ingredients/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ingredients']);
    },
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

  if (!user) {
    return (
      <div className="text-gray-600 dark:text-gray-300">Please log in…</div>
    );
  }

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

      <TableContainer>
        <Table>
          <Thead>
            <TrHead>
              <Th>Name</Th>
              <Th>Measurement</Th>
              <Th>Purchase Size</Th>
              <Th>Avg Cost</Th>
              <Th>Cost/Oz</Th>
              <Th>Actions</Th>
            </TrHead>
          </Thead>
          <Tbody>
            {data?.content?.map((i: any) => (
              <Tr key={i.id}>
                <Td>{i.name}</Td>
                <Td>{i.measurementType}</Td>
                <Td>
                  {i.purchaseSize} {i.measurementType}
                </Td>
                <Td>${i.averageCost}</Td>
                <Td>${i.costPerOunce}</Td>
                <Td>
                  <button
                    onClick={() => setEditing(i)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(i.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

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

      <AnimatePresence initial={false} mode="wait">
        {editing && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EditIngredientModal
              ingredient={editing}
              onClose={() => setEditing(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
