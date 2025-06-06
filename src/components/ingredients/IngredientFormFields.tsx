import React, { useEffect, useState } from 'react';

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
  hasSubmitted: boolean;
};

export default function IngredientFormFields({
  form,
  handleChange,
  hasSubmitted,
}: Props) {
  const [touched, setTouched] = useState({
    name: false,
    purchaseSize: false,
    averageCost: false,
  });

  useEffect(() => {
    if (!hasSubmitted) {
      setTouched({
        name: false,
        purchaseSize: false,
        averageCost: false,
      });
    }
  }, [hasSubmitted]);

  const errors = {
    name:
      (hasSubmitted || touched.name) && form.name.trim() === ''
        ? 'Name is required.'
        : '',
    purchaseSize:
      (hasSubmitted || touched.purchaseSize) &&
      (!form.purchaseSize || isNaN(Number(form.purchaseSize)))
        ? 'Purchase size must be a number.'
        : '',
    averageCost:
      (hasSubmitted || touched.averageCost) &&
      (!form.averageCost || isNaN(Number(form.averageCost)))
        ? 'Average cost must be a number.'
        : '',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:flex-1">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="..."
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
              errors.name
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } dark:text-white focus:outline-none focus:ring`}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="md:w-[260px] flex-1">
          <label
            htmlFor="purchaseSize"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Purchase Size
          </label>
          <div className="flex mt-1">
            <input
              id="purchaseSize"
              type="number"
              name="purchaseSize"
              placeholder="..."
              value={form.purchaseSize}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, purchaseSize: true }))}
              className={`border bg-white dark:bg-gray-800 text-sm text-black dark:text-white rounded-l-md p-2 focus:outline-none focus:ring w-2/3 ${
                errors.purchaseSize
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              }`}
              required
            />
            <select
              id="measurementType"
              name="measurementType"
              value={form.measurementType}
              onChange={handleChange}
              className="border border-l-0 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-black dark:text-white rounded-r-md p-2 focus:outline-none w-1/3"
            >
              <option value="OZ">OZ</option>
            </select>
          </div>
          {errors.purchaseSize && (
            <p className="text-red-500 text-xs mt-1">{errors.purchaseSize}</p>
          )}
        </div>

        <div className="md:w-[200px] flex-1">
          <label
            htmlFor="averageCost"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Average Cost
          </label>
          <input
            id="averageCost"
            name="averageCost"
            value={form.averageCost}
            onChange={handleChange}
            placeholder="..."
            onBlur={() => setTouched((t) => ({ ...t, averageCost: true }))}
            type="number"
            className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
              errors.averageCost
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } dark:text-white focus:outline-none focus:ring`}
            required
          />
          {errors.averageCost && (
            <p className="text-red-500 text-xs mt-1">{errors.averageCost}</p>
          )}
        </div>
      </div>
    </div>
  );
}
