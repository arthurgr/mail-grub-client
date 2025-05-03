import React from "react";
import IngredientForm from "./components/IngredientForm";
import IngredientList from "./components/IngredientList";

export default function App() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">MailGrub</h1>
            <IngredientForm />
            <IngredientList />
        </div>
    );
}
