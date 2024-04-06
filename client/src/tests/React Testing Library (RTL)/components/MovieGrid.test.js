import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as gridService from '../../../api/services/gridService';
import MovieGrid from "../../../components/MovieGrid";
import { axe, toHaveNoViolations } from 'jest-axe';

jest.mock('../../../api/services/gridService', () => ({
    getMovieGrid: jest.fn()
}));

// Extend expect for accessibility checks
expect.extend(toHaveNoViolations);

describe('MovieGrid Component Tests', () => {
    let store;
    const theme = createTheme();

    beforeEach(() => {
        store = configureStore({
            reducer: {
                // Your reducers here
                recommendations: (state = {}, action) => state,
            },
        });

        // Reset mock before each test
        gridService.getMovieGrid.mockClear();
        gridService.getMovieGrid.mockResolvedValue([
            // Mocked data returned by your API
        ]);
    });

    // Render Test
    it('renders the component correctly', async () => {
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieGrid />
                </ThemeProvider>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('Discover Movies')).toBeInTheDocument());
    });

    // Interaction Test
    it('changes filter on button click', async () => {
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieGrid />
                </ThemeProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Movies'));
        // Assuming "Movies" button filters the grid, you should assert that the grid has been updated. This may involve checking for a specific movie's presence or absence in the grid.
    });

    // Effect Test
    it('fetches movies on component mount', async () => {
        gridService.getMovieGrid.mockResolvedValue([
            // Your mock data here
        ]);

        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieGrid />
                </ThemeProvider>
            </Provider>
        );

        // Verify that movies are rendered after fetching
    });

    // Accessibility Test
    it('is accessible', async () => {
        const { container } = render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieGrid />
                </ThemeProvider>
            </Provider>
        );

        // Run accessibility checks on the rendered container and expect no violations
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // Edge Case Test
    it('displays no data message when no movies are available', async () => {
        gridService.getMovieGrid.mockResolvedValue([]); // Simulate no movies being returned

        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieGrid />
                </ThemeProvider>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('No Data Available')).toBeInTheDocument());
    });

    // Error Handling Test
    it('handles fetch errors gracefully', async () => {
        gridService.getMovieGrid.mockRejectedValue(new Error('Failed to fetch'));

        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieGrid />
                </ThemeProvider>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('Failed to fetch movies:')).toBeInTheDocument());
    });
});
