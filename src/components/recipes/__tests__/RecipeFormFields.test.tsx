import { render, screen, fireEvent } from '@testing-library/react';
import RecipeFormFields from '../RecipeFormFields';
import { vi, describe, it, expect } from 'vitest';

describe('RecipeFormFields', () => {
  const setup = (overrides = {}) => {
    const props = {
      name: '',
      setName: vi.fn(),
      itemsMade: '' as '',
      setItemsMade: vi.fn(),
      ingredients: [],
      setIngredients: vi.fn(),
      ingredientData: [{ id: 1, name: 'Sugar' }],
      hasSubmitted: true,
      ...overrides,
    };

    render(<RecipeFormFields {...props} />);
    return props;
  };

  it('shows validation messages when required fields are empty', () => {
    setup();

    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Items made must be greater than 0/i),
    ).toBeInTheDocument();
  });

  it('calls setName and setItemsMade on change', () => {
    const { setName, setItemsMade } = setup();

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Cake' },
    });
    fireEvent.change(screen.getByLabelText(/Items Made/i), {
      target: { value: '5' },
    });

    expect(setName).toHaveBeenCalledWith('Cake');
    expect(setItemsMade).toHaveBeenCalledWith(5);
  });

  it('can add a new ingredient row', () => {
    const setIngredients = vi.fn();
    setup({ setIngredients, ingredients: [], hasSubmitted: false });

    fireEvent.click(screen.getByText(/\+ Add Ingredient/i));
    expect(setIngredients).toHaveBeenCalled();
  });
});
