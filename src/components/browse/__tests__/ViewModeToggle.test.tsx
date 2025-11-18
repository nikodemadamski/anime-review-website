import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewModeToggle from '../ViewModeToggle';

describe('ViewModeToggle', () => {
  it('renders three buttons', () => {
    const mockOnChange = vi.fn();
    render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

    expect(screen.getByRole('button', { name: /large view/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /grid view/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /list view/i })).toBeInTheDocument();
  });

  it('calls onChange callback with correct mode when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

    await user.click(screen.getByRole('button', { name: /grid view/i }));
    expect(mockOnChange).toHaveBeenCalledWith('grid');

    await user.click(screen.getByRole('button', { name: /list view/i }));
    expect(mockOnChange).toHaveBeenCalledWith('list');

    await user.click(screen.getByRole('button', { name: /large view/i }));
    expect(mockOnChange).toHaveBeenCalledWith('large');
  });

  it('applies active state styling correctly', () => {
    const mockOnChange = vi.fn();
    const { rerender } = render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

    const largeButton = screen.getByRole('button', { name: /large view/i });
    const gridButton = screen.getByRole('button', { name: /grid view/i });
    const listButton = screen.getByRole('button', { name: /list view/i });

    // Large is active
    expect(largeButton).toHaveAttribute('aria-pressed', 'true');
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
    expect(listButton).toHaveAttribute('aria-pressed', 'false');
    expect(largeButton).toHaveClass('bg-accent');

    // Switch to grid
    rerender(<ViewModeToggle currentMode="grid" onChange={mockOnChange} />);
    expect(largeButton).toHaveAttribute('aria-pressed', 'false');
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    expect(listButton).toHaveAttribute('aria-pressed', 'false');
    expect(gridButton).toHaveClass('bg-accent');

    // Switch to list
    rerender(<ViewModeToggle currentMode="list" onChange={mockOnChange} />);
    expect(largeButton).toHaveAttribute('aria-pressed', 'false');
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
    expect(listButton).toHaveClass('bg-accent');
  });

  it('handles keyboard navigation with Enter key', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

    const gridButton = screen.getByRole('button', { name: /grid view/i });
    gridButton.focus();
    await user.keyboard('{Enter}');

    expect(mockOnChange).toHaveBeenCalledWith('grid');
  });

  it('handles keyboard navigation with Space key', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

    const listButton = screen.getByRole('button', { name: /list view/i });
    listButton.focus();
    await user.keyboard(' ');

    expect(mockOnChange).toHaveBeenCalledWith('list');
  });
});
