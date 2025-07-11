import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaxList from '../TaxList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

const mockTaxes = {
  content: [
    {
      id: 1,
      jurisdiction: 'Colorado',
      taxRate: 8.25,
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

describe('TaxList', () => {
  beforeEach(() => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockTaxes });
    mockedAxios.delete = vi.fn().mockResolvedValue({});
  });

  it('renders table headers and data', async () => {
    renderWithClient(<TaxList />);
    await screen.findByText('Colorado');
    expect(screen.getByText('Jurisdiction')).toBeInTheDocument();
    expect(screen.getByText('Tax Rate')).toBeInTheDocument();
    expect(screen.getByText('8.25%')).toBeInTheDocument();
  });

  it('performs search when submitted', async () => {
    renderWithClient(<TaxList />);
    fireEvent.change(screen.getByPlaceholderText('...'), {
      target: { value: 'Colorado' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/taxes'),
      expect.objectContaining({
        params: expect.objectContaining({ jurisdiction: 'Colorado' }),
      }),
    );
  });

  it('clears search input when Clear is clicked', async () => {
    renderWithClient(<TaxList />);
    fireEvent.change(screen.getByPlaceholderText('...'), {
      target: { value: 'Colorado' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await screen.findByRole('button', { name: 'Clear' });
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByPlaceholderText('...')).toHaveValue('');
  });

  it('deletes a tax entry when Delete is clicked', async () => {
    renderWithClient(<TaxList />);
    await screen.findByText('Colorado');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/taxes/delete/1'),
      );
    });
  });
});
