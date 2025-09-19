import React from 'react';
import { useAuth } from '../auth/AuthContext';
import ThemeToggle from './ThemeToggle';

export const UserMenu: React.FC = () => {
  const { user, logout, loading } = useAuth();
  if (loading) return null;

  return user ? (
    <div className="flex items-center gap-3">
      <img
        className="h-8 w-8 rounded-full"
        src={user.photoURL ?? undefined}
        alt={user.displayName ?? 'User'}
      />
      <span className="text-sm">{user.displayName ?? user.email}</span>
      <ThemeToggle />
      <button
        className="px-2.5 py-1.5 text-sm border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        onClick={logout}
      >
        Sign out
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <ThemeToggle />
    </div>
  );
};
