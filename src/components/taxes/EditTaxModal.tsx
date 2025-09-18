import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TaxFormFields from './TaxFormFields';
import { api } from '../../api/client';

type Props = {
  tax: any;
  onClose: () => void;
};

export default function EditTaxModal({ tax, onClose }: Props) {
  const [form, setForm] = useState({
    jurisdiction: tax.jurisdiction,
    taxRate: tax.taxRate.toString(),
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updated: { jurisdiction: string; taxRate: number }) =>
      api.patch(`/taxes/update/${tax.id}`, updated),
    onSuccess: () => {
      queryClient.invalidateQueries(['taxes']);
      onClose();
      setHasSubmitted(false);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    mutation.mutate({
      jurisdiction: form.jurisdiction,
      taxRate: parseFloat(form.taxRate),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-2xl border dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Edit Tax</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TaxFormFields
            form={form}
            handleChange={handleChange}
            hasSubmitted={hasSubmitted}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
