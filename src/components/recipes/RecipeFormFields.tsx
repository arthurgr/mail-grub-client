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
      <div className="flex gap-2">
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Recipe Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name}</span>
          )}
        </div>

        <div className="flex flex-col w-40">
          <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Items Made
          </label>
          <input
            type="number"
            value={itemsMade}
            onChange={(e) => setItemsMade(Number(e.target.value))}
            className={`border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.itemsMade ? 'border-red-500' : ''
            }`}
          />
          {errors.itemsMade && (
            <span className="text-xs text-red-500">{errors.itemsMade}</span>
          )}
        </div>
      </div>

      {ingredients.map((entry, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <div className="flex flex-col w-1/3">
            <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Ingredient
            </label>
            <select
              value={entry.ingredientId}
              onChange={(e) =>
                updateIngredient(idx, 'ingredientId', Number(e.target.value))
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              {ingredientData?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-1/3">
            <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Amount
            </label>
            <input
              type="number"
              value={entry.amount}
              onChange={(e) =>
                updateIngredient(idx, 'amount', Number(e.target.value))
              }
              className={`border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.ingredients[idx] ? 'border-red-500' : ''
              }`}
            />
            {errors.ingredients[idx] && (
              <span className="text-xs text-red-500">
                {errors.ingredients[idx]}
              </span>
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
        className="text-sm text-blue-500 hover:underline mt-2"
      >
        + Add Ingredient
      </button>
    </>
  );
}
