import React, { useEffect, useState } from 'react';

type Props = {
  form: {
    jurisdiction: string;
    taxRate: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  hasSubmitted: boolean;
};

export default function TaxFormFields({
  form,
  handleChange,
  hasSubmitted,
}: Props) {
  const [touched, setTouched] = useState({
    jurisdiction: false,
    taxRate: false,
  });

  useEffect(() => {
    if (!hasSubmitted) {
      setTouched({
        jurisdiction: false,
        taxRate: false,
      });
    }
  }, [hasSubmitted]);

  const errors = {
    jurisdiction:
      (hasSubmitted || touched.jurisdiction) && form.jurisdiction.trim() === ''
        ? 'Jurisdiction is required.'
        : '',
    taxRate:
      (hasSubmitted || touched.taxRate) &&
      (!form.taxRate || isNaN(Number(form.taxRate)))
        ? 'Tax rate must be a valid number.'
        : '',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:flex-1">
          <label
            htmlFor="jurisdiction"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Jurisdiction
          </label>
          <input
            id="jurisdiction"
            name="jurisdiction"
            value={form.jurisdiction}
            onChange={handleChange}
            placeholder="..."
            onBlur={() => setTouched((t) => ({ ...t, jurisdiction: true }))}
            className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
              errors.jurisdiction
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } dark:text-white focus:outline-none focus:ring`}
            required
          />
          {errors.jurisdiction && (
            <p className="text-red-500 text-xs mt-1">{errors.jurisdiction}</p>
          )}
        </div>

        <div className="md:w-[200px] flex-1">
          <label
            htmlFor="taxRate"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Tax Rate (%)
          </label>
          <input
            id="taxRate"
            name="taxRate"
            value={form.taxRate}
            onChange={handleChange}
            placeholder="..."
            type="number"
            step="0.01"
            onBlur={() => setTouched((t) => ({ ...t, taxRate: true }))}
            className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
              errors.taxRate
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } dark:text-white focus:outline-none focus:ring`}
            required
          />
          {errors.taxRate && (
            <p className="text-red-500 text-xs mt-1">{errors.taxRate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
