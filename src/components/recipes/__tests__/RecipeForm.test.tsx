import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeForm from '../RecipeForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, { deep: true });

const renderWithClient = (ui: React.ReactNode) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
};

describe('RecipeForm', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: {
        content: [{ id: 1, name: 'Flour' }],
      },
    });
  });

  // it('submits form with valid data', async () => {
  //   mockedAxios.get.mockResolvedValueOnce({
  //     data: {
  //       content: [{ id: 1, name: 'Flour' }],
  //     },
  //   });
  //
  //   mockedAxios.post.mockResolvedValueOnce({});
  //
  //   renderWithClient(<RecipeForm />);
  //
  //   fireEvent.change(screen.getByLabelText(/Name/i), {
  //     target: { value: 'Cookies' },
  //   });
  //
  //   fireEvent.change(screen.getByLabelText(/Items Made/i), {
  //     target: { value: '12' },
  //   });
  //
  //   await waitFor(() => {
  //     expect(screen.getByText('+ Add Ingredient')).toBeEnabled();
  //   });
  //
  //   fireEvent.click(screen.getByText('+ Add Ingredient'));
  //
  //   const selectWrapper = await screen.findByTestId(
  //     'ingredient-select-wrapper',
  //   );
  //
  //   fireEvent.mouseDown(selectWrapper.firstChild as HTMLElement);
  //   fireEvent.click(screen.getByText('Flour'));
  //
  //   fireEvent.change(await screen.findByLabelText(/Amount/i), {
  //     target: { value: '2' },
  //   });
  //
  //   fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));
  //
  //   await waitFor(() => {
  //     expect(mockedAxios.post).toHaveBeenCalledWith(
  //       expect.stringContaining('/recipes/add'),
  //       expect.objectContaining({
  //         name: 'Cookies',
  //         itemsMade: 12,
  //         ingredients: [{ ingredientId: 1, amount: 2 }],
  //       }),
  //     );
  //   });
  // });

  it('does not submit if validation fails', async () => {
    renderWithClient(<RecipeForm />);

    fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));

    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Items made must be greater than 0/i),
    ).toBeInTheDocument();
  });
});
