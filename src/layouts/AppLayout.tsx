import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserMenu } from '../components/UserMenu';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="p-6 max-w-4xl mx-auto dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MailGrub</h1>
        <UserMenu />
      </div>

      <nav className="flex border-b dark:border-gray-700 mb-6">
        {[
          { label: 'Ingredients', path: '/ingredients' },
          { label: 'Recipes', path: '/recipes' },
          { label: 'Packaging', path: '/packaging' },
          { label: 'Taxes', path: '/taxes' },
        ].map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium ${
              location.pathname === path
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 dark:text-gray-300 dark:hover:text-blue-400'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* All protected pages render here */}
      <Outlet />
    </div>
  );
}
