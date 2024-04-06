import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe'; // Ensure jest-axe is installed
import DashBoard from '../../components/DashBoard';

// Extend expect for accessibility checks
expect.extend(toHaveNoViolations);

const mockChildren = [
    <div key="child1">Child 1</div>,
    <div key="child2">Child 2</div>,
    <div key="child3">Child 3</div>,
];

describe('DashBoard Component', () => {
    // Render Test
    it('renders DashBoard with children', () => {
        render(<DashBoard>{mockChildren}</DashBoard>);
        mockChildren.forEach((child) => {
            expect(screen.getByText(child.props.children)).toBeInTheDocument();
        });
    });

    it('renders DashBoard with additional props', () => {
        // Define mock props
        const mockProps = {
            title: 'Dashboard Title',
            subtitle: 'Dashboard Subtitle',
        };
        // Render DashBoard with mock props
        render(<DashBoard {...mockProps}>{mockChildren}</DashBoard>);
        // Verify if the title and subtitle are rendered correctly
        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
        expect(screen.getByText(mockProps.subtitle)).toBeInTheDocument();
    });

    // Accessibility Test
    it('has no accessibility violations', async () => {
        const { container } = render(<DashBoard>{mockChildren}</DashBoard>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
