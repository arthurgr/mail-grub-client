import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import IngredientForm from './components/ingredients/IngredientForm';
import IngredientList from './components/ingredients/IngredientList';
import RecipeForm from './components/recipes/RecipeForm';
import RecipeList from './components/recipes/RecipeList';
import PackagingForm from './components/packaging/PackagingForm';
import PackagingList from './components/packaging/PackagingList';
import TaxForm from './components/taxes/TaxForm';
import TaxList from './components/taxes/TaxList';
import Login from './auth/Login';
import AppLayout from './layouts/AppLayout';
import { RequireAuth } from './auth/RequireAuth';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/ingredients" replace />} />
        <Route
          path="/ingredients"
          element={
            <>
              <IngredientForm />
              <IngredientList />
            </>
          }
        />
        <Route
          path="/recipes"
          element={
            <>
              <RecipeForm />
              <RecipeList />
            </>
          }
        />
        <Route
          path="/packaging"
          element={
            <>
              <PackagingForm />
              <PackagingList />
            </>
          }
        />
        <Route
          path="/taxes"
          element={
            <>
              <TaxForm />
              <TaxList />
            </>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
