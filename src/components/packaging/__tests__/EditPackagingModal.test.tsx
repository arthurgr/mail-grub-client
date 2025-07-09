import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditPackagingModal from '../EditPackagingModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as unknown as {
  patch: ReturnType<typeof vi.fn>;
};

const queryClient = new QueryClient();

describe('EditPackagingModal', () => {
  const onCloseMock = vi.fn();
  const packagingMock = {
    id: 1,
    packagingMaterials: 'Box',
    averageCost: '2.50',
    quantity: '5',
    procurement: 'Supplier A',
  };

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <EditPackagingModal packaging={packagingMock} onClose={onCloseMock} />
      </QueryClientProvider>,
    );

  it('renders form fields with initial values', () => {
    renderComponent();
    expect(screen.getByDisplayValue('Box')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2.50')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Supplier A')).toBeInTheDocument();
  });

  it('calls mutation and closes on submit', async () => {
    mockedAxios.patch.mockResolvedValueOnce({ data: {} });

    renderComponent();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/packaging/update/1'),
        expect.objectContaining({
          packagingMaterials: 'Box',
          averageCost: 2.5,
          quantity: 5,
          procurement: 'Supplier A',
        }),
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('calls onClose when Cancel is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
