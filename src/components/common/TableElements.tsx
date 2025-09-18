import React from 'react';

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-normal">
      {children}
    </th>
  );
}

export function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
      {children}
    </td>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">{children}</tr>
  );
}

export function TrHead({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>;
}

export function Thead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-gray-100 dark:bg-gray-800 font-light">
      {children}
    </thead>
  );
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="min-w-full table-auto text-sm border border-gray-200 dark:border-gray-700">
      {children}
    </table>
  );
}

export function TableContainer({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}
