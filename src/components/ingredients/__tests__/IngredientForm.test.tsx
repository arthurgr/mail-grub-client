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
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  it('handles API error gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    renderWithClient(<IngredientForm />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Salt' },
    });
    fireEvent.change(screen.getByLabelText(/Purchase Size/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByLabelText(/Average Cost/i), {
      target: { value: '2' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      // You can also assert error handling UI if you add a toast or message display
    });
  });
});
