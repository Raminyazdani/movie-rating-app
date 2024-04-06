import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import RatingComponent from '../../../components/Rating';
import ratingReducer from '../../../features/rating/ratingSlice';
import authReducer from '../../../features/auth/authSlice';
import { axe, toHaveNoViolations } from 'jest-axe';

// Mock store setup
const store = configureStore({
    reducer: {
        ratings: ratingReducer,
        auth: authReducer,
    },
    preloadedState: {
        ratings: {
            ratings: []
        },
        auth: {
            user: { id: 'user1', email: 'test@example.com' },
            status: 'succeeded',
            error: null
        },
        user: {
            userId: 'user1'
        }
    }
});

// Extend expect for accessibility checks
expect.extend(toHaveNoViolations);

describe('RatingComponent Tests', () => {
    const movieId = 'movie1';
    const type = 'movie';

    // Render Test
    it('renders correctly', () => {
        render(
            <Provider store={store}>
                <RatingComponent movieId={movieId} type={type} />
            </Provider>
        );
        expect(screen.getAllByRole('button')).toHaveLength(5); // Expect 5 star buttons for rating
    });

    // Props Test
    it('renders with correct size based on props', () => {
        render(
            <Provider store={store}>
                <RatingComponent movieId={movieId} type={type} size="large" />
            </Provider>
        );
        const stars = screen.getAllByRole('button');
        expect(stars[0]).toHaveStyle(`font-size: ${iconSizes.large}`);
    });

    // Interaction Test
    it('updates rating on star click', async () => {
        render(
            <Provider store={store}>
                <RatingComponent movieId={movieId} type={type} />
            </Provider>
        );
        const thirdStar = screen.getAllByRole('button')[2];
        await userEvent.click(thirdStar);
        // Verify state change or dispatched action for updating the rating
    });

    it('reflects the current rating state', () => {
        // Mock initial Redux state with a specific rating for 'movie1'.
        const customStore = configureStore({
            reducer: {
                ratings: () => ({ ratings: [{ 'movie1': { rating: 3, type: 'movie' } }] }),
                auth: authReducer,
                user: () => ({ userId: 'user1' })
            }
        });

        render(
            <Provider store={customStore}>
                <RatingComponent movieId="movie1" type="movie" />
            </Provider>
        );

        // Check if 3 stars are highlighted
        const filledStars = screen.getAllByIcon(StarIcon); // Assuming getAllByIcon is a custom query for icons
        expect(filledStars.length).toBe(3);
    });

    it('fetches ratings on component mount', () => {
        jest.spyOn(ratingActions, 'fetchRatings').mockImplementation(() => (dispatch) => {});

        render(
            <Provider store={store}>
                <RatingComponent movieId="movie1" type="movie" />
            </Provider>
        );

        expect(ratingActions.fetchRatings).toHaveBeenCalled();
    });

    // Accessibility Test
    it('is accessible', async () => {
        const { container } = render(
            <Provider store={store}>
                <RatingComponent movieId="movie1" type="movie" />
            </Provider>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('handles zero ratings correctly', () => {
        render(
            <Provider store={store}>
                <RatingComponent movieId="movie2" type="movie" />
            </Provider>
        );

        // Assuming zero ratings mean no stars are filled
        const starBorderIcons = screen.getAllByIcon(StarBorderIcon); // Custom query
        expect(starBorderIcons.length).toBe(5); // All stars should be unfilled
    });

    it('displays an error message if rating fails', async () => {
        jest.spyOn(ratingActions, 'addRating').mockImplementation(() => async (dispatch) => {
            throw new Error('Rating failed');
        });

        render(
            <Provider store={store}>
                <RatingComponent movieId="movie3" type="movie" />
            </Provider>
        );

        const rateButton = screen.getByLabelText('Rate 1 star'); // Assuming aria-labels for buttons
        fireEvent.click(rateButton);

        await waitFor(() => {
            expect(screen.getByText('Rating failed')).toBeInTheDocument();
        });
    });
});
