import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
} from '../common/Tables/TableElements';
import TableSearch from '../common/Tables/TableSearch';
import TableFooter from '../common/Tables/TableFooter';
import ModalAnimation from '../common/Modals/ModalAnimation';

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

      <TableFooter
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        isLastPage={!!data?.meta?.last}
        onPrevious={() => setPage((prev) => Math.max(prev - 1, 0))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      <ModalAnimation isOpen={!!editing}>
        <EditIngredientModal
          ingredient={editing}
          onClose={() => setEditing(null)}
        />
      </ModalAnimation>
    </div>
  );
}
