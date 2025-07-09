import { render, screen, fireEvent } from '@testing-library/react';
import PackagingFormFields from '../PackagingFormFields';
import { describe, it, expect, vi } from 'vitest';

describe('PackagingFormFields', () => {
  const defaultForm = {
    packagingMaterials: '',
    quantity: '',
    averageCost: '',
    procurement: '',
  };

  const handleChange = vi.fn();

  const setup = (form = defaultForm, hasSubmitted = false) => {
    render(
      <PackagingFormFields
        form={form}
        handleChange={handleChange}
        hasSubmitted={hasSubmitted}
      />,
    );
  };

  it('renders all fields correctly', () => {
    setup();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Average Cost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Procurement Notes/i)).toBeInTheDocument();
  });

  it('shows validation error messages on blur', () => {
    setup(defaultForm, false);
    fireEvent.blur(screen.getByLabelText(/Name/i));
    fireEvent.blur(screen.getByLabelText(/Quantity/i));
    fireEvent.blur(screen.getByLabelText(/Average Cost/i));

    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantity must be a number/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Average cost must be a number/i),
    ).toBeInTheDocument();
  });

  it('shows validation errors if submitted with invalid inputs', () => {
    setup(defaultForm, true);
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantity must be a number/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Average cost must be a number/i),
    ).toBeInTheDocument();
  });

  it('does not show errors when fields are valid', () => {
    setup(
      {
        packagingMaterials: 'Box',
        quantity: '10',
        averageCost: '5.25',
        procurement: '',
      },
      true,
    );
    expect(screen.queryByText(/Name is required/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Quantity must be a number/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Average cost must be a number/i),
    ).not.toBeInTheDocument();
  });
});
