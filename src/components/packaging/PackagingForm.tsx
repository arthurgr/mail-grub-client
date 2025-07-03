import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PackagingFormFields from './PackagingFormFields';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PackagingForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    packagingMaterials: '',
    quantity: '',
    averageCost: '',
    procurement: '',
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (newPackaging: {
      packagingMaterials: string;
      quantity: number;
      averageCost: number;
      procurement: string;
    }) => axios.post(`${API_BASE_URL}/packaging/add`, newPackaging),
    onSuccess: () => {
      queryClient.invalidateQueries(['packaging']);
      setForm({
        packagingMaterials: '',
        quantity: '',
        averageCost: '',
        procurement: '',
      });
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
      ...form,
      quantity: parseInt(form.quantity),
      averageCost: parseFloat(form.averageCost),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <h2 className="text-lg font-semibold">Create Packaging</h2>
      <PackagingFormFields
        form={form}
        handleChange={handleChange}
        hasSubmitted={hasSubmitted}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Packaging
      </button>
    </form>
  );
}
