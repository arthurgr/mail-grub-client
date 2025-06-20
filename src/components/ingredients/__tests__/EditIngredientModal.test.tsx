import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditIngredientModal from '../EditIngredientModal';
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

describe('EditIngredientModal', () => {
  const ingredient = {
    id: 1,
    name: 'Flour',
    measurementType: 'OZ',
    purchaseSize: 16,
    averageCost: 3.5,
  };

  const onClose = vi.fn();

  beforeEach(() => {
    mockedAxios.patch.mockResolvedValue({ data: {} });
  });

  it('renders form fields with initial data', () => {
    renderWithClient(
      <EditIngredientModal ingredient={ingredient} onClose={onClose} />,
    );
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Flour');
    expect(screen.getByLabelText(/Purchase Size/i)).toHaveValue(
      ingredient.purchaseSize,
    );
    expect(screen.getByLabelText(/Average Cost/i)).toHaveValue(
      ingredient.averageCost,
    );
  });

  it('submits updated values and calls onClose', async () => {
    renderWithClient(
      <EditIngredientModal ingredient={ingredient} onClose={onClose} />,
    );
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Whole Wheat Flour' },
    });
    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/ingredients/update/1'),
        expect.objectContaining({ name: 'Whole Wheat Flour' }),
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('calls onClose when Cancel is clicked', () => {
    renderWithClient(
      <EditIngredientModal ingredient={ingredient} onClose={onClose} />,
    );
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onClose).toHaveBeenCalled();
  });
});
