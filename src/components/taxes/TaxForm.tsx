import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TaxFormFields from './TaxFormFields';
import { api } from '../../api/client';

export default function TaxForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    jurisdiction: '',
    taxRate: '',
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (newTax: { jurisdiction: string; taxRate: number }) =>
      api.post(`/taxes/add`, newTax),
    onSuccess: () => {
      queryClient.invalidateQueries(['taxes']);
      setForm({ jurisdiction: '', taxRate: '' });
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
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <h2 className="text-lg font-semibold">Create Tax</h2>
      <TaxFormFields
        form={form}
        handleChange={handleChange}
        hasSubmitted={hasSubmitted}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Tax
      </button>
    </form>
  );
}
