// External Imports
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For extending expect with additional matchers
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { axe, toHaveNoViolations } from 'jest-axe'; // For accessibility testing

// Material UI Imports
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Component Under Test
import HistoryTable from '../../components/HistoryTable';

// Initial setup for Redux Mock Store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Initial setup for jest-axe
expect.extend(toHaveNoViolations); // Extend expect for accessibility checks

// Test Suite for HistoryTable Component
describe('HistoryTable Component Tests', () => {
    const initialState = {
        ratings: { ratings: [] },
        favorites: { items: [] },
        reviews: { reviews: [] },
    };
    const store = mockStore(initialState); // Create a mock store with the initial state
    const theme = createTheme(); // Create a default MUI theme

    // Render Test - Checks if the component renders without crashing
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <HistoryTable />
                </ThemeProvider>
            </Provider>
        );
        expect(screen.getByText(/History Table/i)).toBeInTheDocument();
    });

    // Accessibility Test - Ensures there are no accessibility violations
    it('is accessible', async () => {
        const { container } = render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <HistoryTable />
                </ThemeProvider>
            </Provider>
        );

        // Run accessibility checks on the rendered container and expect no violations
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
