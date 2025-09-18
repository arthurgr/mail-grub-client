import React from 'react';
import { useAuth } from '../auth/AuthContext';

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
      <button className="rounded-lg border px-3 py-2" onClick={logout}>
        Sign out
      </button>
    </div>
  ) : (
    <a className="rounded-lg border px-3 py-2" href="/login">
      Sign in
    </a>
  );
};
