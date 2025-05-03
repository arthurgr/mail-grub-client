import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
            axios.post("/ingredients/add", newIngredient),
        onSuccess: () => queryClient.invalidateQueries(["ingredients"]),
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        mutation.mutate({
            ...form,
            purchaseSize: parseFloat(form.purchaseSize),
            averageCost: parseFloat(form.averageCost),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <input
                className="border p-2 w-full"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ingredient Name"
                required
            />
            <input
                className="border p-2 w-full"
                name="purchaseSize"
                value={form.purchaseSize}
                onChange={handleChange}
                placeholder="Purchase Size"
                type="number"
                required
            />
            <input
                className="border p-2 w-full"
                name="averageCost"
                value={form.averageCost}
                onChange={handleChange}
                placeholder="Average Cost"
                type="number"
                required
            />
            <select
                className="border p-2 w-full"
                name="measurementType"
                value={form.measurementType}
                onChange={handleChange}
            >
                <option value="OZ">OZ</option>
                <option value="GRAM">GRAM</option>
            </select>
            <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded"
            >
                Add Ingredient
            </button>
        </form>
    );
}
