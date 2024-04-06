import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MovieCarousel from '../../components/MovieCarousel';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as carouselService from '../../api/services/carouselService';
import { axe, toHaveNoViolations } from 'jest-axe';

// Mock the carousel service
jest.mock('../../api/services/carouselService', () => ({
    getMovieCarousel: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
    ratings: { ratings: [] },
    favorites: { items: [] },
    reviews: { reviews: [] }
});
const theme = createTheme();

// Extend expect for accessibility checks
expect.extend(toHaveNoViolations);

describe('MovieCarousel Component', () => {
    beforeEach(() => {
        carouselService.getMovieCarousel.mockClear();
    });

    // Render Test
    it('renders MovieCarousel component', async () => {
        carouselService.getMovieCarousel.mockResolvedValue([]);
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieCarousel />
                </ThemeProvider>
            </Provider>
        );
        await waitFor(() => expect(screen.getByText(/Featured Movies/i)).toBeInTheDocument());
    });

    // Interaction Test
    it('changes category on button click', async () => {
        carouselService.getMovieCarousel.mockResolvedValue([]);
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieCarousel />
                </ThemeProvider>
            </Provider>
        );
        const nowPlayingButton = screen.getByText('Now Playing');
        nowPlayingButton.click();
        await waitFor(() => expect(carouselService.getMovieCarousel).toHaveBeenCalledWith('now_playing'));
    });

    // State and Effect Test
    it('fetches movies on category change', async () => {
        const mockMovies = [{ Title: 'Test Movie', imdbID: 'tt1234567', Poster: 'test.jpg', Plot: 'Test plot' }];
        carouselService.getMovieCarousel.mockResolvedValue(mockMovies);
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieCarousel />
                </ThemeProvider>
            </Provider>
        );
        await waitFor(() => expect(screen.getByText('Test Movie')).toBeInTheDocument());
    });

    // Accessibility Test using jest-axe
    it('is accessible with no violations', async () => {
        const { container } = render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieCarousel />
                </ThemeProvider>
            </Provider>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // Edge Case Test
    it('displays loading indicator when fetching movies', () => {
        carouselService.getMovieCarousel.mockResolvedValue([]);
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieCarousel />
                </ThemeProvider>
            </Provider>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    // Error Handling Test
    it('handles fetch error gracefully', async () => {
        carouselService.getMovieCarousel.mockRejectedValue(new Error('Fetch error'));
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MovieCarousel />
                </ThemeProvider>
            </Provider>
        );
        await waitFor(() => expect(screen.getByText(/No Data Available/i)).toBeInTheDocument());
    });
});
