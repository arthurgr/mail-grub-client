import React from 'react';

type Ingredient = {
  id: number;
  name: string;
};

type IngredientEntry = {
  ingredientId: number;
  amount: number | '';
};

type Props = {
  name: string;
  setName: (val: string) => void;
  itemsMade: number | '';
  setItemsMade: (val: number) => void;
  ingredients: IngredientEntry[];
  setIngredients: React.Dispatch<React.SetStateAction<IngredientEntry[]>>;
  ingredientData: Ingredient[] | undefined;
  hasSubmitted: boolean;
};

export default function RecipeFormFields({
  name,
  setName,
  itemsMade,
  setItemsMade,
  ingredients,
  setIngredients,
  ingredientData,
  hasSubmitted,
}: Props) {
  const updateIngredient = (
    idx: number,
    field: keyof IngredientEntry,
    value: number | '',
  ) => {
    setIngredients((prev) =>
      prev.map((i, iIdx) => (iIdx === idx ? { ...i, [field]: value } : i)),
    );
  };

  const addIngredient = () => {
    if (ingredientData?.length) {
      setIngredients((prev) => [
        ...prev,
        { ingredientId: ingredientData[0].id, amount: '' },
      ]);
    }
  };

  const removeIngredient = (idx: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const errors = {
    name: hasSubmitted && name.trim() === '' ? 'Name is required.' : '',
    itemsMade:
      hasSubmitted && (itemsMade === '' || Number(itemsMade) <= 0)
        ? 'Items made must be greater than 0.'
        : '',
    ingredients: ingredients.map((entry) =>
      hasSubmitted && (entry.amount === '' || Number(entry.amount) <= 0)
        ? 'Amount must be greater than 0.'
        : '',
    ),
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Name
          </label>
          <input
            type="text"
            value={name}
            placeholder="..."
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
              errors.name
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } dark:text-white focus:outline-none focus:ring`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="md:w-[260px] flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Items Made
          </label>
          <input
            type="number"
            value={itemsMade}
            placeholder="..."
            onChange={(e) => setItemsMade(Number(e.target.value))}
            className={`mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 ${
              errors.itemsMade
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } dark:text-white focus:outline-none focus:ring`}
          />
          {errors.itemsMade && (
            <p className="text-red-500 text-xs mt-1">{errors.itemsMade}</p>
          )}
        </div>
      </div>

      {ingredients.map((entry, idx) => (
        <div key={idx} className="flex gap-4 items-end mt-4">
          <div className="flex flex-col w-1/3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Ingredient
            </label>
            <select
              value={entry.ingredientId}
              onChange={(e) =>
                updateIngredient(idx, 'ingredientId', Number(e.target.value))
              }
              className="mt-1 border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              {ingredientData?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-1/3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Amount
            </label>
            <input
              type="number"
              value={entry.amount}
              onChange={(e) =>
                updateIngredient(idx, 'amount', Number(e.target.value))
              }
              className={`mt-1 border p-2 rounded bg-white dark:bg-gray-800 dark:text-white ${
                errors.ingredients[idx]
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              }`}
            />
            {errors.ingredients[idx] && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ingredients[idx]}
              </p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => removeIngredient(idx)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addIngredient}
        className="text-sm text-blue-500 hover:underline mt-4"
      >
        + Add Ingredient
      </button>
    </>
  );
}
