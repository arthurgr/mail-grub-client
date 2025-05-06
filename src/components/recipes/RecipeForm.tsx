import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import RecipeFormFields from './RecipeFormFields';

export default function RecipeForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [itemsMade, setItemsMade] = useState<number | ''>('');
  const [ingredients, setIngredients] = useState<
    { ingredientId: number; amount: number | '' }[]
  >([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { data: ingredientData } = useQuery({
    queryKey: ['ingredientsList'],
    queryFn: () =>
      axios
        .get('http://localhost:8080/ingredients?page=0&size=100')
        .then((res) => res.data.content),
  });

  const mutation = useMutation({
    mutationFn: (newRecipe: {
      name: string;
      itemsMade: number;
      ingredients: { ingredientId: number; amount: number }[];
    }) => axios.post('http://localhost:8080/recipes/add', newRecipe),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes']);
      setName('');
      setItemsMade('');
      setIngredients([]);
      setHasSubmitted(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const valid =
      name.trim() !== '' &&
      itemsMade !== '' &&
      Number(itemsMade) > 0 &&
      ingredients.length > 0 &&
      ingredients.every((i) => i.amount !== '' && Number(i.amount) > 0);

    if (!valid) return;

    const recipe = {
      name,
      itemsMade: Number(itemsMade),
      ingredients: ingredients.map((i) => ({
        ingredientId: i.ingredientId,
        amount: Number(i.amount),
      })),
    };

    mutation.mutate(recipe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <h2 className="text-lg font-semibold">Create Recipes</h2>
      <RecipeFormFields
        name={name}
        setName={setName}
        itemsMade={itemsMade}
        setItemsMade={setItemsMade}
        ingredients={ingredients}
        setIngredients={setIngredients}
        ingredientData={ingredientData}
        hasSubmitted={hasSubmitted}
      />

      <div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Recipe
        </button>
      </div>
    </form>
  );
}
