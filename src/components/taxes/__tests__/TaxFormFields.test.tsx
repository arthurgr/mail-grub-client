import { render, screen, fireEvent } from '@testing-library/react';
import TaxFormFields from '../TaxFormFields';
import { describe, it, expect, vi } from 'vitest';

describe('TaxFormFields', () => {
  const setup = (
    form = { jurisdiction: '', taxRate: '' },
    hasSubmitted = false,
  ) => {
    const handleChange = vi.fn();
    render(
      <TaxFormFields
        form={form}
        handleChange={handleChange}
        hasSubmitted={hasSubmitted}
      />,
    );
    return { handleChange };
  };

  it('renders input fields', () => {
    setup();
    expect(screen.getByLabelText(/Jurisdiction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tax Rate/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitted with empty fields', () => {
    setup({ jurisdiction: '', taxRate: '' }, true);
    expect(screen.getByText(/Jurisdiction is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Tax rate must be a valid number/i),
    ).toBeInTheDocument();
  });

  it('does not show errors on first render', () => {
    setup();
    expect(
      screen.queryByText(/Jurisdiction is required/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Tax rate must be a valid number/i),
    ).not.toBeInTheDocument();
  });

  it('calls handleChange on input change', () => {
    const { handleChange } = setup();
    fireEvent.change(screen.getByLabelText(/Jurisdiction/i), {
      target: { value: 'Oregon' },
    });
    expect(handleChange).toHaveBeenCalled();
  });
});
