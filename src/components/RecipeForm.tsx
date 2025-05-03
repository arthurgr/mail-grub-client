import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Ingredient = {
    id: number;
    name: string;
    measurementType: string;
};

export default function RecipeForm() {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [itemsMade, setItemsMade] = useState<number | "">("");
    const [ingredients, setIngredients] = useState<
        { ingredientId: number; amount: number | "" }[]
    >([]);

    const { data: ingredientData } = useQuery({
        queryKey: ["ingredientsList"],
        queryFn: () =>
            axios
                .get("http://localhost:8080/ingredients?page=0&size=100")
                .then((res) => res.data.content),
    });

    const mutation = useMutation({
        mutationFn: (newRecipe) =>
            axios.post("http://localhost:8080/recipes/add", newRecipe),
        onSuccess: () => {
            queryClient.invalidateQueries(["recipes"]);
            setName("");
            setItemsMade("");
            setIngredients([]);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !itemsMade || ingredients.length === 0) return;

        const recipe = {
            name,
            itemsMade,
            ingredients: ingredients.map((i) => ({
                ingredientId: i.ingredientId,
                amount: Number(i.amount),
            })),
        };

        mutation.mutate(recipe);
    };

    const addIngredient = () => {
        if (ingredientData?.length) {
            setIngredients((prev) => [
                ...prev,
                { ingredientId: ingredientData[0].id, amount: "" },
            ]);
        }
    };

    const removeIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold">Create Recipes</h2>
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
                        onChange={(e) => {
                            const updated = [...ingredients];
                            updated[idx].ingredientId = Number(e.target.value);
                            setIngredients(updated);
                        }}
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
                        onChange={(e) => {
                            const updated = [...ingredients];
                            updated[idx].amount = Number(e.target.value);
                            setIngredients(updated);
                        }}
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
