import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EditRecipeModal from './EditRecipeModal';
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
} from '../common/Tables/TableElements';
import TableSearch from '../common/Tables/TableSearch';
import TableFooter from '../common/Tables/TableFooter';
import ModalAnimation from '../common/Modals/ModalAnimation';

export default function RecipeList() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<null | any>(null);

  const queryClient = useQueryClient();
  const size = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', page, search],
    queryFn: () =>
      api
        .get(`/recipes`, {
          params: { page, size, name: search },
        })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/recipes/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
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
    return (
      <div className="text-gray-600 dark:text-gray-300">Loading recipes...</div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      <TableSearch
        search={search}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSubmit={handleSearchSubmit}
        onClear={handleClearSearch}
      />

      <TableContainer>
        <Table>
          <Thead>
            <TrHead>
              <Th>Name</Th>
              <Th>Items Made</Th>
              <Th>Ingredients</Th>
              <Th>Total Cost</Th>
              <Th>Cost per Item</Th>
              <Th>Actions</Th>
            </TrHead>
          </Thead>
          <Tbody>
            {data?.content?.map((r: any) => (
              <Tr key={r.id}>
                <Td>{r.name}</Td>
                <Td>{r.itemsMade}</Td>
                <Td>
                  {r.ingredients.map((ing: any, idx: number) => (
                    <div key={idx}>
                      {ing.name} - {ing.amount} OZ
                    </div>
                  ))}
                </Td>
                <Td>${r.totalCost}</Td>
                <Td>${r.costPerItem}</Td>
                <Td>
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
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <TableFooter
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        isLastPage={!!data?.meta?.last}
        onPrevious={() => setPage((prev) => Math.max(prev - 1, 0))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      <ModalAnimation isOpen={!!editing}>
        <EditRecipeModal recipe={editing} onClose={() => setEditing(null)} />
      </ModalAnimation>
    </div>
  );
}
