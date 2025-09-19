import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export type IngredientOption = {
  value: number;
  label: string;
};

type Props = {
  value: number;
  onChange: (value: number) => void;
  options: IngredientOption[];
};

export default function IngredientSelect({ value, onChange, options }: Props) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains('dark');
    setIsDarkMode(checkDarkMode());

    const observer = new MutationObserver(() => {
      setIsDarkMode(checkDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <Select
      value={selected}
      onChange={(option) => option && onChange(option.value)}
      options={options}
      isSearchable
      className="w-full text-sm"
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: isDarkMode ? '#1f2937' : 'white', // Tailwind: bg-gray-800 / bg-white
          borderColor: state.isFocused
            ? '#3B82F6'
            : isDarkMode
              ? '#374151'
              : '#D1D5DB',
          color: isDarkMode ? '#F9FAFB' : '#111827',
          boxShadow: 'none',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
          color: isDarkMode ? '#F9FAFB' : '#111827',
          borderRadius: '0.375rem',
          zIndex: 50,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? isDarkMode
              ? '#374151'
              : '#E5E7EB'
            : 'transparent',
          color: isDarkMode ? '#F9FAFB' : '#111827',
        }),
        singleValue: (base) => ({
          ...base,
          color: isDarkMode ? '#F9FAFB' : '#111827',
        }),
        placeholder: (base) => ({
          ...base,
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
        }),
        input: (base) => ({
          ...base,
          color: isDarkMode ? '#F9FAFB' : '#111827',
        }),
      }}
    />
  );
}
