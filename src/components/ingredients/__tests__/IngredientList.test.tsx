import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IngredientList from '../IngredientList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

const mockIngredients = {
  content: [
    {
      id: 1,
      name: 'Flour',
      measurementType: 'ounce',
      purchaseSize: 16,
      averageCost: 3.5,
      costPerOunce: 0.22,
    },
  ],
  meta: {
    page: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1,
    last: true,
  },
};

describe('IngredientList', () => {
  beforeEach(() => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockIngredients });
  });

  it('renders table headers and data', async () => {
    renderWithClient(<IngredientList />);
    await screen.findByText('Flour');
    expect(screen.getByText('Measurement')).toBeInTheDocument();
    expect(screen.getByText('$3.5')).toBeInTheDocument();
  });

  it('performs search when submitted', async () => {
    renderWithClient(<IngredientList />);
    fireEvent.change(screen.getByPlaceholderText('...'), {
      target: { value: 'Flour' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/ingredients'),
      expect.objectContaining({
        params: expect.objectContaining({ name: 'Flour' }),
      }),
    );
  });

  it('clears search input when Clear is clicked', async () => {
    renderWithClient(<IngredientList />);
    fireEvent.change(screen.getByPlaceholderText('...'), {
      target: { value: 'Flour' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByRole('button', { name: 'Clear' }));

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByPlaceholderText('...')).toHaveValue('');
  });

  // it('shows loading state', async () => {
  //   mockedAxios.get = vi.fn(() => new Promise(() => {})); // never resolves
  //   renderWithClient(<IngredientList />);
  //
  //   await waitFor(() => {
  //     expect(screen.getByText((text) => text.includes('Loading'))).toBeInTheDocument();
  //   });
  // });
});
