import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PackagingForm from '../PackagingForm';
import { vi } from 'vitest';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('axios');
const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

describe('PackagingForm', () => {
  const setup = () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <PackagingForm />
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    mockedAxios.post = vi.fn();
  });

  it('renders input fields and submit button', () => {
    setup();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Average Cost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Procurement Notes/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Packaging/i }),
    ).toBeInTheDocument();
  });

  it('does not submit form if required fields are empty', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /Add Packaging/i }));
    await waitFor(() => {
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid inputs', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Box' },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByLabelText(/Average Cost/i), {
      target: { value: '4.99' },
    });
    fireEvent.change(screen.getByLabelText(/Procurement Notes/i), {
      target: { value: 'Uline' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Add Packaging/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/packaging/add'),
        {
          packagingMaterials: 'Box',
          quantity: 10,
          averageCost: 4.99,
          procurement: 'Uline',
        },
      );
    });
  });
});
