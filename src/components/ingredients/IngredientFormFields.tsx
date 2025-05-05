import React from 'react';

type Props = {
  form: {
    name: string;
    purchaseSize: string;
    averageCost: string;
    measurementType: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
};

export default function IngredientFormFields({ form, handleChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Ingredient Name"
        required
      />
      <input
        className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
        name="purchaseSize"
        value={form.purchaseSize}
        onChange={handleChange}
        placeholder="Purchase Size"
        type="number"
        required
      />
      <input
        className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
        name="averageCost"
        value={form.averageCost}
        onChange={handleChange}
        placeholder="Average Cost"
        type="number"
        required
      />
      <select
        className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none"
        name="measurementType"
        value={form.measurementType}
        onChange={handleChange}
      >
        <option value="OZ">OZ</option>
        <option value="GRAM">GRAM</option>
      </select>
    </div>
  );
}
