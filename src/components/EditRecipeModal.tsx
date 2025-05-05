import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Ingredient = {
    id: number;
    name: string;
};

type Recipe = {
    id: number;
    name: string;
    itemsMade: number;
    ingredients: { ingredientId: number; amount: number }[];
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
        }))
    );

    const { data: ingredientData } = useQuery({
        queryKey: ["ingredientsList"],
        queryFn: () =>
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/ingredients?page=0&size=100`)
                .then((res) => res.data.content),
    });

    const mutation = useMutation({
        mutationFn: (updated: Recipe) =>
            axios.patch(`${import.meta.env.VITE_API_BASE_URL}/recipes/update/${updated.id}`, {
                name: updated.name,
                itemsMade: updated.itemsMade,
                ingredients: updated.ingredients,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(["recipes"]);
            onClose();
        },
    });

    const updateIngredient = (idx: number, field: "ingredientId" | "amount", value: any) => {
        setIngredients((prev) =>
            prev.map((i, iIdx) => (iIdx === idx ? { ...i, [field]: value } : i))
        );
    };

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
            <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-lg w-full space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Recipe</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    <input
                        type="number"
                        value={itemsMade}
                        onChange={(e) => setItemsMade(Number(e.target.value))}
                        className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    {ingredients.map((ing, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <select
                                value={ing.ingredientId}
                                onChange={(e) => updateIngredient(idx, "ingredientId", Number(e.target.value))}
                                className="w-1/2 border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            >
                                {ingredientData?.map((i: Ingredient) => (
                                    <option key={i.id} value={i.id}>
                                        {i.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={ing.amount}
                                onChange={(e) => updateIngredient(idx, "amount", Number(e.target.value))}
                                className="w-1/2 border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>
                    ))}
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
