import React from "react";
import IngredientForm from "./components/IngredientForm";
import IngredientList from "./components/IngredientList";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
    return (
        <div className="p-6 max-w-4xl mx-auto dark:bg-gray-900 dark:text-white min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">MailGrub</h1>
                <ThemeToggle />
            </div>
            <IngredientForm />
            <IngredientList />
            <hr className="my-6 border-gray-200 dark:border-gray-700" />
            <RecipeForm />
            <RecipeList />
        </div>
    );
}
