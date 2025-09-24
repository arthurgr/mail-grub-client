import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EditTaxModal from './EditTaxModal';
import { api } from '../../api/client';
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TrHead,
} from '../common/Tables/TableElements';
import TableSearch from '../common/Tables/TableSearch';
import TableFooter from '../common/Tables/TableFooter';
import ModalAnimation from '../common/Modals/ModalAnimation';

export default function TaxList() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [editing, setEditing] = useState(null);

  const size = 20;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['taxes', page, search],
    queryFn: () =>
      api
        .get(`/taxes`, {
          params: { page, size, jurisdiction: search },
        })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/taxes/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['taxes']),
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
              <Th>Jurisdiction</Th>
              <Th>Tax Rate</Th>
              <Th>Actions</Th>
            </TrHead>
          </Thead>
          <Tbody>
            {data?.content?.map((tax: any) => (
              <Tr key={tax.id}>
                <Td>{tax.jurisdiction}</Td>
                <Td>{tax.taxRate}%</Td>
                <Td>
                  <button
                    onClick={() => setEditing(tax)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(tax.id)}
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
        <EditTaxModal tax={editing} onClose={() => setEditing(null)} />
      </ModalAnimation>
    </div>
  );
}
