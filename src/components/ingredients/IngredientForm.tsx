import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import IngredientFormFields from './IngredientFormFields';
import { api } from '../../api/client';

export default function IngredientForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    measurementType: 'OZ',
    purchaseSize: '',
    averageCost: '',
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (newIngredient: {
      name: string;
      measurementType: string;
      purchaseSize: number;
      averageCost: number;
    }) => api.post(`/ingredients/add`, newIngredient),
    onSuccess: () => {
      queryClient.invalidateQueries(['ingredients']);
      setForm({
        name: '',
        measurementType: 'OZ',
        purchaseSize: '',
        averageCost: '',
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
      purchaseSize: parseFloat(form.purchaseSize),
      averageCost: parseFloat(form.averageCost),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <h2 className="text-lg font-semibold">Create Ingredients</h2>
      <IngredientFormFields
        form={form}
        handleChange={handleChange}
        hasSubmitted={hasSubmitted}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Ingredient
      </button>
    </form>
  );
}
