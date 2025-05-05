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
};

export default function RecipeFormFields({
  name,
  setName,
  itemsMade,
  setItemsMade,
  ingredients,
  setIngredients,
  ingredientData,
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

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Recipe name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="number"
          placeholder="Items made"
          value={itemsMade}
          onChange={(e) => setItemsMade(Number(e.target.value))}
          className="border px-3 py-2 rounded w-40 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      {ingredients.map((entry, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <select
            value={entry.ingredientId}
            onChange={(e) =>
              updateIngredient(idx, 'ingredientId', Number(e.target.value))
            }
            className="border px-3 py-2 rounded w-1/3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {ingredientData?.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={entry.amount}
            onChange={(e) =>
              updateIngredient(idx, 'amount', Number(e.target.value))
            }
            className="border px-3 py-2 rounded w-1/3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={() => removeIngredient(idx)}
            className="text-red-500 hover:underline text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addIngredient}
        className="text-sm text-blue-500 hover:underline"
      >
        + Add Ingredient
      </button>
    </>
  );
}
