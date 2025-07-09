import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PackagingList from '../PackagingList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const renderWithClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe('PackagingList', () => {
  const mockData = {
    content: [
      {
        id: 1,
        packagingMaterials: 'Box',
        averageCost: 5,
        quantity: 10,
        costPerUnit: 0.5,
        procurement: 'Uline',
      },
    ],
    meta: {
      page: 0,
      totalPages: 1,
      last: true,
    },
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockData });
  });

  it('renders table with data', async () => {
    renderWithClient(<PackagingList />);
    expect(await screen.findByText(/Box/)).toBeInTheDocument();
    expect(screen.getByText('$5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('$0.5')).toBeInTheDocument();
    expect(screen.getByText('Uline')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    renderWithClient(<PackagingList />);
    const input = await screen.findByPlaceholderText('...');
    fireEvent.change(input, { target: { value: 'Box' } });
    expect(input).toHaveValue('Box');
  });

  it('opens and closes edit modal', async () => {
    renderWithClient(<PackagingList />);
    fireEvent.click(await screen.findByText(/Edit/i));
    expect(screen.getByText(/Edit Packaging/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() =>
      expect(screen.queryByText(/Edit Packaging/i)).not.toBeInTheDocument(),
    );
  });
});
