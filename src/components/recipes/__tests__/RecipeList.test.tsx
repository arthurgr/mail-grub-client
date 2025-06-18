import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeList from '../RecipeList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockRecipes = {
  content: [
    {
      id: 1,
      name: 'Cake',
      itemsMade: 12,
      ingredients: [{ name: 'Flour', amount: 4 }],
      totalCost: 10.5,
      costPerItem: 0.88,
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

beforeEach(() => {
  mockedAxios.get.mockResolvedValue({ data: mockRecipes });
});

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe('RecipeList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it('shows loading state', () => {
  //   mockedAxios.get = vi.fn(() => new Promise(() => {}));
  //   renderWithClient(<RecipeList />);
  //   expect(screen.getByText(/Loading recipes.../i)).toBeInTheDocument();
  // });

  it('renders recipe data', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        content: [
          {
            id: 1,
            name: 'Chocolate Cake',
            itemsMade: 12,
            ingredients: [{ name: 'Flour', amount: 16 }],
            totalCost: 6.5,
            costPerItem: 0.54,
          },
        ],
        meta: {
          page: 0,
          totalPages: 1,
          last: true,
        },
      },
    });

    renderWithClient(<RecipeList />);
    expect(await screen.findByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.getByText(/Flour - 16 OZ/)).toBeInTheDocument();
    expect(screen.getByText('$6.5')).toBeInTheDocument();
    expect(screen.getByText('$0.54')).toBeInTheDocument();
  });

  it('performs search when submitted', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        content: [],
        meta: {
          page: 0,
          totalPages: 1,
          last: true,
        },
      },
    });

    renderWithClient(<RecipeList />);
    const input = await screen.findByPlaceholderText('...');
    fireEvent.change(input, {
      target: { value: 'Cake' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/recipes'),
        expect.objectContaining({
          params: expect.objectContaining({ name: 'Cake' }),
        }),
      );
    });
  });

  it('clears search input when Clear is clicked', async () => {
    renderWithClient(<RecipeList />);

    const input = await screen.findByPlaceholderText('...');
    fireEvent.change(input, {
      target: { value: 'Cake' },
    });

    fireEvent.click(screen.getByText('Search'));
    await screen.findByText('Cake');

    fireEvent.click(screen.getByText('Clear'));
    expect(input).toHaveValue('');
  });

  it('disables Previous button on first page', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        content: [],
        meta: {
          page: 0,
          totalPages: 1,
          last: true,
        },
      },
    });

    renderWithClient(<RecipeList />);
    expect(
      await screen.findByRole('button', { name: /Previous/i }),
    ).toBeDisabled();
  });

  it('disables Next button when on last page', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        content: [],
        meta: {
          page: 0,
          totalPages: 1,
          last: true,
        },
      },
    });

    renderWithClient(<RecipeList />);
    expect(await screen.findByRole('button', { name: /Next/i })).toBeDisabled();
  });
});
