import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditRecipeModal from '../EditRecipeModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

const mockIngredientsList = [
  { id: 1, name: 'Flour' },
  { id: 2, name: 'Sugar' },
];

const recipe = {
  id: 1,
  name: 'Cake',
  itemsMade: 12,
  ingredients: [
    { ingredientId: 1, amount: 4, overrideMeasurementType: 'ounce' },
  ],
};

describe('EditRecipeModal', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: { content: mockIngredientsList },
    });
    mockedAxios.patch.mockResolvedValue({});
  });

  it('renders form fields with initial data', async () => {
    renderWithClient(<EditRecipeModal recipe={recipe} onClose={vi.fn()} />);

    expect(await screen.findByLabelText(/Name/i)).toHaveValue('Cake');
    expect(screen.getByLabelText(/Items Made/i)).toHaveValue(12);
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onCloseMock = vi.fn();
    renderWithClient(<EditRecipeModal recipe={recipe} onClose={onCloseMock} />);
    const cancelBtn = await screen.findByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('submits updated recipe', async () => {
    const onCloseMock = vi.fn();
    renderWithClient(<EditRecipeModal recipe={recipe} onClose={onCloseMock} />);

    fireEvent.change(await screen.findByLabelText(/Name/i), {
      target: { value: 'Chocolate Cake' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/recipes/update/1'),
        expect.objectContaining({
          name: 'Chocolate Cake',
          itemsMade: 12,
          ingredients: [
            {
              ingredientId: 1,
              amount: 4,
              overrideMeasurementType: 'ounce',
            },
          ],
        }),
      );
    });

    expect(onCloseMock).toHaveBeenCalled();
  });
});
