import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IngredientForm from '../IngredientForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { vi, describe, it, expect } from 'vitest';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, { deep: true });

const renderWithClient = (ui: React.ReactNode) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
};

describe('IngredientForm', () => {
  it('submits form with valid data', async () => {
    mockedAxios.post.mockResolvedValueOnce({});

    renderWithClient(<IngredientForm />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Sugar' },
    });
    fireEvent.change(screen.getByLabelText(/Purchase Size/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByLabelText(/Average Cost/i), {
      target: { value: '5' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/ingredients/add'),
        expect.objectContaining({
          name: 'Sugar',
          purchaseSize: 10,
          averageCost: 5,
        }),
      );
    });
  });
});
