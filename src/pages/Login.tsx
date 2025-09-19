import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('S3cret!');
  const navigate = useNavigate();
  const from = (useLocation() as any)?.state?.from?.pathname || '/';

  const go = async (fn: () => Promise<void>) => {
    await fn();
    navigate(from, { replace: true });
  };

  return (
    <div className="mx-auto mt-24 max-w-sm rounded-xl border border-b-4 p-6 dark:border-gray-700">
      <h2 className="mb-4 text-xl font-semibold">Sign in</h2>

      <button
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => go(loginWithGoogle)}
      >
        Continue with Google
      </button>

      <div className="my-2 text-center text-sm text-gray-500">or</div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await go(() => loginWithEmail(email, password));
        }}
        className="flex flex-col gap-2"
      >
        <input
          className="mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-1 border p-2 rounded w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          type="submit"
        >
          Sign in with Email
        </button>
      </form>
    </div>
  );
};

export default Login;
