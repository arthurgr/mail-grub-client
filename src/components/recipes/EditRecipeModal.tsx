import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RecipeFormFields from './RecipeFormFields';
import { api } from '../../api/client';

type Recipe = {
  id: number;
  name: string;
  itemsMade: number;
  ingredients: {
    ingredientId: number;
    amount: number;
    overrideMeasurementType?: string | null;
  }[];
};

export default function EditRecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(recipe.name);
  const [itemsMade, setItemsMade] = useState(recipe.itemsMade);
  const [ingredients, setIngredients] = useState(
    recipe.ingredients.map((i: any) => ({
      ingredientId: i.ingredientId ?? i.id,
      amount: i.amount,
      overrideMeasurementType: i.overrideMeasurementType ?? null,
    })),
  );

  const { data: ingredientData } = useQuery({
    queryKey: ['ingredientsList'],
    queryFn: () =>
      api.get(`/ingredients?page=0&size=100`).then((res) => res.data.content),
  });

  const mutation = useMutation({
    mutationFn: (updated: Recipe) =>
      api.patch(`/recipes/update/${updated.id}`, {
        name: updated.name,
        itemsMade: updated.itemsMade,
        ingredients: updated.ingredients,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes']);
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: recipe.id,
      name,
      itemsMade,
      ingredients,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-3xl w-full space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Edit Recipe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RecipeFormFields
            name={name}
            setName={setName}
            itemsMade={itemsMade}
            setItemsMade={setItemsMade}
            ingredients={ingredients}
            setIngredients={setIngredients}
            ingredientData={ingredientData}
            hasSubmitted={false}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
