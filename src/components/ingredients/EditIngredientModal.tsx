import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import IngredientFormFields from './IngredientFormFields';
import { api } from '../../api/client';

type Props = {
  ingredient: any;
  onClose: () => void;
};

export default function EditIngredientModal({ ingredient, onClose }: Props) {
  const [form, setForm] = useState({ ...ingredient });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updated: {
      name: string;
      measurementType: string;
      purchaseSize: number;
      averageCost: number;
    }) => api.patch(`/ingredients/update/${ingredient.id}`, updated),
    onSuccess: () => {
      queryClient.invalidateQueries(['ingredients']);
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
      ...form,
      purchaseSize: parseFloat(form.purchaseSize),
      averageCost: parseFloat(form.averageCost),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-2xl border dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Edit Ingredient</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <IngredientFormFields
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
