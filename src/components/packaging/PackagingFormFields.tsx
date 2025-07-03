import React, { useEffect, useState } from 'react';

type Props = {
  form: {
    packagingMaterials: string;
    quantity: string;
    averageCost: string;
    procurement: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  hasSubmitted: boolean;
};

export default function PackagingFormFields({
  form,
  handleChange,
  hasSubmitted,
}: Props) {
  const [touched, setTouched] = useState({
    packagingMaterials: false,
    quantity: false,
    averageCost: false,
  });

  useEffect(() => {
    if (!hasSubmitted) {
      setTouched({
        packagingMaterials: false,
        quantity: false,
        averageCost: false,
      });
    }
  }, [hasSubmitted]);

  const errors = {
    packagingMaterials:
      (hasSubmitted || touched.packagingMaterials) &&
      form.packagingMaterials.trim() === ''
        ? 'Name is required.'
        : '',
    quantity:
      (hasSubmitted || touched.quantity) &&
      (!form.quantity || isNaN(Number(form.quantity)))
        ? 'Quantity must be a number.'
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
            htmlFor="packagingMaterials"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Name
          </label>
          <input
            id="packagingMaterials"
            name="packagingMaterials"
            value={form.packagingMaterials}
            onChange={handleChange}
            onBlur={() =>
              setTouched((t) => ({ ...t, packagingMaterials: true }))
            }
            placeholder="..."
            className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
              errors.packagingMaterials
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } dark:text-white focus:outline-none focus:ring`}
            required
          />
          {errors.packagingMaterials && (
            <p className="text-red-500 text-xs mt-1">
              {errors.packagingMaterials}
            </p>
          )}
        </div>

        <div className="md:w-[160px] flex-1">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, quantity: true }))}
            placeholder="..."
            className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
              errors.quantity
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } dark:text-white focus:outline-none focus:ring`}
            required
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
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
            type="number"
            value={form.averageCost}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, averageCost: true }))}
            placeholder="..."
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

        <div className="w-full md:flex-1">
          <label
            htmlFor="procurement"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Procurement Notes
          </label>
          <input
            id="procurement"
            name="procurement"
            value={form.procurement}
            onChange={handleChange}
            placeholder="Optional"
            className="mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
          />
        </div>
      </div>
    </div>
  );
}
