import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function IngredientForm() {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        name: "",
        measurementType: "OZ",
        purchaseSize: "",
        averageCost: "",
    });

    const mutation = useMutation({
        mutationFn: (newIngredient) =>
        axios.post(`${API_BASE_URL}/ingredients/add`, newIngredient),
        onSuccess: () => {
            queryClient.invalidateQueries(["ingredients"]);
            setForm({
                name: "",
                measurementType: "OZ",
                purchaseSize: "",
                averageCost: "",
            });
        },
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        mutation.mutate({
            ...form,
            purchaseSize: parseFloat(form.purchaseSize),
            averageCost: parseFloat(form.averageCost),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <div className="flex flex-col gap-2">
                <input
                    className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ingredient Name"
                    required
                />
                <input
                    className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
                    name="purchaseSize"
                    value={form.purchaseSize}
                    onChange={handleChange}
                    placeholder="Purchase Size"
                    type="number"
                    required
                />
                <input
                    className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
                    name="averageCost"
                    value={form.averageCost}
                    onChange={handleChange}
                    placeholder="Average Cost"
                    type="number"
                    required
                />
                <select
                    className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none"
                    name="measurementType"
                    value={form.measurementType}
                    onChange={handleChange}
                >
                    <option value="OZ">OZ</option>
                    <option value="GRAM">GRAM</option>
                </select>
            </div>
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
                Add Ingredient
            </button>
        </form>
    );
}
