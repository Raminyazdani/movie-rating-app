import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../components/footer';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend expect for accessibility checks
expect.extend(toHaveNoViolations);

describe('Footer Component', () => {
    // Render Test
    it('renders the footer component', () => {
        render(<Footer />);
        expect(screen.getByText(/My Movie Rater Website/i)).toBeInTheDocument();
        expect(screen.getByText(`© ${new Date().getFullYear()} Your Website`)).toBeInTheDocument();
    });

    // Accessibility Test
    it('should have no accessibility violations', async () => {
        const { container } = render(<Footer />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
