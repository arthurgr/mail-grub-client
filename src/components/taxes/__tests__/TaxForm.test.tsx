import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaxForm from '../TaxForm';
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

describe('TaxForm', () => {
  it('submits form with valid data', async () => {
    mockedAxios.post.mockResolvedValueOnce({});

    renderWithClient(<TaxForm />);

    fireEvent.change(screen.getByLabelText(/Jurisdiction/i), {
      target: { value: 'Colorado' },
    });
    fireEvent.change(screen.getByLabelText(/Tax Rate/i), {
      target: { value: '0.0825' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add tax/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/taxes/add'),
        { jurisdiction: 'Colorado', taxRate: 0.0825 },
      );
    });
  });

  it('handles API error gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    renderWithClient(<TaxForm />);

    fireEvent.change(screen.getByLabelText(/Jurisdiction/i), {
      target: { value: 'Nevada' },
    });
    fireEvent.change(screen.getByLabelText(/Tax Rate/i), {
      target: { value: '0.07' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add tax/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});
