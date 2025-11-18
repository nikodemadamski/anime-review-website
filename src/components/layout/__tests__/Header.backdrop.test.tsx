import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from '../Header';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

describe('Header - Backdrop Click Blocking', () => {
  const renderHeader = () => {
    return render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render backdrop when mobile menu is open', () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Check if backdrop exists - get all elements with "Close menu" label
    const closeElements = screen.getAllByLabelText('Close menu');
    // The backdrop is the div (first element), not the button
    const backdrop = closeElements.find(el => el.tagName === 'DIV');
    
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveStyle({ zIndex: '40' });
  });

  it('should have backdrop properties that block clicks to underlying content', async () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Verify backdrop is present (the div, not the button)
    const closeElements = screen.getAllByLabelText('Close menu');
    const backdrop = closeElements.find(el => el.tagName === 'DIV');
    expect(backdrop).toBeInTheDocument();
    
    // Verify backdrop has properties that would block clicks in a real browser:
    // 1. Fixed positioning covers entire viewport
    expect(backdrop).toHaveClass('fixed');
    expect(backdrop).toHaveClass('inset-0');
    
    // 2. High z-index to be above content (z-40, below menu at z-50)
    expect(backdrop).toHaveStyle({ zIndex: '40' });
    
    // 3. Semi-transparent background that's visible
    expect(backdrop).toHaveClass('bg-black/50');
    
    // 4. Backdrop blur for visual separation
    expect(backdrop).toHaveClass('backdrop-blur-sm');
    
    // 5. Has click handler to close menu
    expect(backdrop).toHaveAttribute('aria-label', 'Close menu');
    
    // In a real browser, these properties ensure the backdrop blocks clicks
    // to underlying content by being positioned above them in the stacking context
  });

  it('should close menu when backdrop is clicked', async () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Verify menu is open
    expect(screen.getByText('Menu')).toBeInTheDocument();
    
    // Click backdrop (the div, not the button)
    const closeElements = screen.getAllByLabelText('Close menu');
    const backdrop = closeElements.find(el => el.tagName === 'DIV');
    fireEvent.click(backdrop!);
    
    // Wait for menu to close
    await waitFor(() => {
      expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });
  });

  it('should have proper z-index to overlay content', () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Check backdrop z-index (the div, not the button)
    const closeElements = screen.getAllByLabelText('Close menu');
    const backdrop = closeElements.find(el => el.tagName === 'DIV');
    
    expect(backdrop).toHaveStyle({ zIndex: '40' });
    
    // Check that backdrop has fixed positioning
    expect(backdrop).toHaveClass('fixed');
    expect(backdrop).toHaveClass('inset-0');
  });

  it('should have semi-transparent background', () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Check backdrop styling (the div, not the button)
    const closeElements = screen.getAllByLabelText('Close menu');
    const backdrop = closeElements.find(el => el.tagName === 'DIV');
    
    expect(backdrop).toHaveClass('bg-black/50');
    expect(backdrop).toHaveClass('backdrop-blur-sm');
  });

  it('should lock body scroll when menu is open', () => {
    renderHeader();
    
    // Initially, body should not have overflow hidden
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Body scroll should be locked (iOS Safari compatible)
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.width).toBe('100%');
  });

  it('should restore body scroll when menu is closed', async () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Body scroll should be locked
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');
    
    // Close menu by clicking backdrop (the div, not the button)
    const closeElements = screen.getAllByLabelText('Close menu');
    const backdrop = closeElements.find(el => el.tagName === 'DIV');
    fireEvent.click(backdrop!);
    
    // Wait for menu to close and body scroll to be restored
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('');
      expect(document.body.style.position).toBe('');
      expect(document.body.style.width).toBe('');
    });
  });

  it('should close menu when ESC key is pressed', async () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Verify menu is open
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');
    
    // Press ESC key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    // Wait for menu to close
    await waitFor(() => {
      expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });
    
    // Verify body scroll is restored
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
  });

  it('should not close menu when other keys are pressed', async () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Verify menu is open
    expect(screen.getByText('Menu')).toBeInTheDocument();
    
    // Press other keys (Enter, Space, etc.)
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(screen.getByText('Menu')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: ' ' });
    expect(screen.getByText('Menu')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByText('Menu')).toBeInTheDocument();
    
    // Menu should still be open
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should close menu when a navigation link is clicked', async () => {
    renderHeader();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Verify menu is open
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');
    
    // Click on a navigation link (Browse All)
    const browseLink = screen.getAllByText('Browse All')[1]; // Get the mobile menu link (second one)
    fireEvent.click(browseLink);
    
    // Wait for menu to close
    await waitFor(() => {
      expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });
    
    // Verify body scroll is restored
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
  });

  it('should close menu when any navigation link is clicked', async () => {
    renderHeader();
    
    // Test multiple links to ensure all have the close handler
    const linksToTest = ['Home', 'Browse All', 'Personality Quiz', 'Contact'];
    
    for (const linkText of linksToTest) {
      // Open mobile menu
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      // Verify menu is open
      expect(screen.getByText('Menu')).toBeInTheDocument();
      
      // Click on the navigation link
      // For links that appear in both desktop and mobile nav, get the mobile one
      const links = screen.getAllByText(linkText);
      const mobileLink = links.length > 1 ? links[1] : links[0];
      fireEvent.click(mobileLink);
      
      // Wait for menu to close
      await waitFor(() => {
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
      });
      
      // Verify body scroll is restored
      expect(document.body.style.overflow).toBe('');
      expect(document.body.style.position).toBe('');
    }
  });
});
