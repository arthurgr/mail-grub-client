import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTaxModal from '../EditTaxModal';
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

const tax = {
  id: 1,
  jurisdiction: 'Colorado',
  taxRate: 0.0825,
};

describe('EditTaxModal', () => {
  beforeEach(() => {
    mockedAxios.patch.mockResolvedValue({});
  });

  it('renders form fields with initial data', () => {
    renderWithClient(<EditTaxModal tax={tax} onClose={vi.fn()} />);
    expect(screen.getByLabelText(/Jurisdiction/i)).toHaveValue('Colorado');
    expect(screen.getByLabelText(/Tax Rate/i)).toHaveValue(0.0825);
  });

  it('calls onClose when Cancel is clicked', () => {
    const onCloseMock = vi.fn();
    renderWithClient(<EditTaxModal tax={tax} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('submits updated tax values', async () => {
    const onCloseMock = vi.fn();
    renderWithClient(<EditTaxModal tax={tax} onClose={onCloseMock} />);

    fireEvent.change(screen.getByLabelText(/Jurisdiction/i), {
      target: { value: 'New Mexico' },
    });
    fireEvent.change(screen.getByLabelText(/Tax Rate/i), {
      target: { value: '0.09' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/taxes/update/1'),
        expect.objectContaining({
          jurisdiction: 'New Mexico',
          taxRate: 0.09,
        }),
      );
    });

    expect(onCloseMock).toHaveBeenCalled();
  });
});
