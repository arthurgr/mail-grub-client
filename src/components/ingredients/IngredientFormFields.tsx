import React, { useState } from 'react';

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
  const [touched, setTouched] = useState({
    name: false,
    purchaseSize: false,
    averageCost: false,
  });

  const errors = {
    name: touched.name && form.name.trim() === '' ? 'Name is required.' : '',
    purchaseSize:
      touched.purchaseSize &&
      (!form.purchaseSize || isNaN(Number(form.purchaseSize)))
        ? 'Purchase size must be a number.'
        : '',
    averageCost:
      touched.averageCost &&
      (!form.averageCost || isNaN(Number(form.averageCost)))
        ? 'Average cost must be a number.'
        : '',
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Name
        <input
          className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
            errors.name
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-700'
          } dark:text-white focus:outline-none focus:ring`}
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </label>

      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Purchase Size
        <input
          className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
            errors.purchaseSize
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-700'
          } dark:text-white focus:outline-none focus:ring`}
          name="purchaseSize"
          value={form.purchaseSize}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, purchaseSize: true }))}
          type="number"
          required
        />
        {errors.purchaseSize && (
          <p className="text-red-500 text-xs mt-1">{errors.purchaseSize}</p>
        )}
      </label>

      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Average Cost
        <input
          className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
            errors.averageCost
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-700'
          } dark:text-white focus:outline-none focus:ring`}
          name="averageCost"
          value={form.averageCost}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, averageCost: true }))}
          type="number"
          required
        />
        {errors.averageCost && (
          <p className="text-red-500 text-xs mt-1">{errors.averageCost}</p>
        )}
      </label>

      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Measurement Type
        <select
          className="mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none"
          name="measurementType"
          value={form.measurementType}
          onChange={handleChange}
        >
          <option value="OZ">OZ</option>
        </select>
      </label>
    </div>
  );
}
