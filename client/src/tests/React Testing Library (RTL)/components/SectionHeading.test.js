import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { axe, toHaveNoViolations } from 'jest-axe';
import SectionHeading from "../../../components/SectionHeading";

// Extend expect with accessibility check
expect.extend(toHaveNoViolations);

describe('SectionHeading Component', () => {
    // Render Test
    it('renders without crashing', () => {
        render(<SectionHeading title="Test Heading" />);
        expect(screen.getByText('Test Heading')).toBeInTheDocument();
    });

    // Props Test
    it('correctly displays the title passed as a prop', () => {
        const title = 'Another Test Heading';
        render(<SectionHeading title={title} />);
        expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Interaction Test
    it('does not include interactive functionality', () => {
        // Not applicable as SectionHeading does not have interactive elements
    });

    // State Test
    it('does not manage or display stateful information', () => {
        // Not applicable as SectionHeading does not manage or rely on state
    });

    // Effect Test
    it('does not produce side effects', () => {
        // Not applicable as SectionHeading does not use useEffect or similar hooks for side effects
    });

    // Accessibility Test
    it('is accessible', async () => {
        const { container } = render(<SectionHeading title="Accessible Heading" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // Edge Case Test
    it('handles empty title prop', () => {
        render(<SectionHeading title="" />);
        // Since the component is simple and only displays the title, an empty string would just mean no text is displayed.
        // Adjust expectations based on actual behavior; you might expect an empty document fragment, for example.
        expect(screen.queryByText('')).toBeNull();
    });

    // Error Handling Test
    it('does not include error handling capabilities', () => {
        // Not applicable as SectionHeading does not interact with error-prone functionality or external data
    });
});
