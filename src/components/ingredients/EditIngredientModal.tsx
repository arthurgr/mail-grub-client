import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Props = {
  ingredient: any;
  onClose: () => void;
};

export default function EditIngredientModal({ ingredient, onClose }: Props) {
  const [form, setForm] = useState({ ...ingredient });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updated) =>
      axios.patch(
        `${API_BASE_URL}/ingredients/update/${ingredient.id}`,
        updated,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(['ingredients']);
      onClose();
    },
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      ...form,
      purchaseSize: parseFloat(form.purchaseSize),
      averageCost: parseFloat(form.averageCost),
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-md border dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Edit Ingredient</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            name="purchaseSize"
            value={form.purchaseSize}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            name="averageCost"
            value={form.averageCost}
            onChange={handleChange}
            type="number"
            required
          />
          <select
            name="measurementType"
            value={form.measurementType}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="OZ">OZ</option>
            <option value="GRAM">GRAM</option>
          </select>
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
