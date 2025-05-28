import React from 'react';
import IngredientSelect from '../IngredientSelect';

type Ingredient = {
  id: number;
  name: string;
};

type IngredientEntry = {
  ingredientId: number;
  amount: number | '';
  overrideMeasurementType: string;
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
    value: string | number | '',
  ) => {
    setIngredients((prev) =>
      prev.map((i, iIdx) => (iIdx === idx ? { ...i, [field]: value } : i)),
    );
  };

  const addIngredient = () => {
    if (ingredientData?.length) {
      setIngredients((prev) => [
        ...prev,
        {
          ingredientId: ingredientData[0].id,
          amount: '',
          overrideMeasurementType: 'OZ',
        },
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

  const ingredientOptions =
    ingredientData?.map((i) => ({ value: i.id, label: i.name })) ?? [];

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:flex-1">
          <label
            htmlFor="recipe-name"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Name
          </label>
          <input
            id="recipe-name"
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
          <label
            htmlFor="items-made"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Items Made
          </label>
          <input
            id="items-made"
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
            <label
              htmlFor={`ingredient-select-${idx}`}
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Ingredient
            </label>
            <IngredientSelect
              value={entry.ingredientId}
              onChange={(val) => updateIngredient(idx, 'ingredientId', val)}
              options={ingredientOptions}
            />
          </div>

          <div className="flex flex-col w-1/3">
            <label
              htmlFor={`ingredient-amount-${idx}`}
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Amount
            </label>
            <div className="flex mt-1">
              <input
                id={`ingredient-amount-${idx}`}
                type="number"
                value={entry.amount}
                onChange={(e) =>
                  updateIngredient(idx, 'amount', Number(e.target.value))
                }
                className={`border bg-white dark:bg-gray-800 text-sm text-black dark:text-white rounded-l-md p-2 focus:outline-none focus:ring w-2/3 ${
                  errors.ingredients[idx]
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              <select
                id={`ingredient-unit-${idx}`}
                value={entry.overrideMeasurementType}
                onChange={(e) =>
                  updateIngredient(
                    idx,
                    'overrideMeasurementType',
                    e.target.value,
                  )
                }
                className="border border-l-0 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-black dark:text-white rounded-r-md p-2 focus:outline-none w-1/3"
              >
                <option value="OZ">OZ</option>
                <option value="LB">LB</option>
                <option value="KG">KG</option>
              </select>
            </div>
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
