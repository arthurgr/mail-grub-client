import { render, screen, fireEvent } from '@testing-library/react';
import IngredientFormFields from '../IngredientFormFields';
import { vi } from 'vitest';

describe('IngredientFormFields', () => {
  const setup = (formOverrides = {}) => {
    const form = {
      name: '',
      purchaseSize: '',
      averageCost: '',
      measurementType: 'OZ',
      ...formOverrides,
    };

    const handleChange = vi.fn();
    render(
      <IngredientFormFields
        form={form}
        handleChange={handleChange}
        hasSubmitted={true}
      />,
    );
    return { handleChange };
  };

  it('shows validation messages when fields are empty and hasSubmitted is true', () => {
    setup();

    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Purchase size must be a number/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Average cost must be a number/i),
    ).toBeInTheDocument();
  });

  it('calls handleChange when inputs are updated', () => {
    const { handleChange } = setup();

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Flour' },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error if purchaseSize is not a number', () => {
    setup({ purchaseSize: 'abc' });

    expect(
      screen.getByText(/Purchase size must be a number/i),
    ).toBeInTheDocument();
  });

  it('shows error if averageCost is not a number', () => {
    setup({ averageCost: 'xyz' });

    expect(
      screen.getByText(/Average cost must be a number/i),
    ).toBeInTheDocument();
  });
});
