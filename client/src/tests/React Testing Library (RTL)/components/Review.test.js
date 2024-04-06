import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import ReviewComponent from '../../../components/Review';
import reviewReducer from '../../../features/review/reviewSlice';
import authReducer from '../../../features/auth/authSlice';
import userReducer from '../../../features/user/userSlice';
import { axe, toHaveNoViolations } from 'jest-axe';

// Initial state for tests
const initialState = {
    reviews: {
        reviews: []
    },
    auth: {
        user: null
    },
    user: {
        userId: null
    }
};

// Function to render the component with custom initial state
const renderComponent = (newState = initialState) => {
    const store = configureStore({
        reducer: {
            reviews: reviewReducer,
            auth: authReducer,
            user: userReducer
        },
        preloadedState: newState
    });

    return render(
        <Provider store={store}>
            <ReviewComponent movieId="testMovieId" type="movie" />
        </Provider>
    );
};

// Test Suite
describe('ReviewComponent Tests', () => {
    // Render Test
    it('renders correctly', () => {
        renderComponent();
        expect(screen.getByPlaceholderText('Your Review')).toBeInTheDocument();
    });

    // Props Test
    it('accepts movieId and type as props', () => {
        renderComponent();
        // This tests the presence of the component itself since it doesn't render anything specific with props directly
        expect(screen.getByPlaceholderText('Your Review')).toBeInTheDocument();
    });

    // Interaction Test
    it('allows typing in the review input', async () => {
        renderComponent();
        const input = screen.getByPlaceholderText('Your Review');
        await userEvent.type(input, 'Great movie!');
        expect(input).toHaveValue('Great movie!');
    });

    // State Test
    it('updates the review state on input change', async () => {
        renderComponent();
        const input = screen.getByPlaceholderText('Your Review');
        await userEvent.type(input, 'Loved it!');
        expect(input).toHaveValue('Loved it!');
    });

    // Load Initial Review Test
    it('loads initial review if exists', () => {
        const customInitialState = {
            ...initialState,
            reviews: {
                reviews: [{ 'testMovieId': { review: 'An existing review', type: 'movie' } }]
            },
            auth: {
                user: { email: 'test@example.com' }
            },
            user: {
                userId: 'user1'
            }
        };
        renderComponent(customInitialState);
        expect(screen.getByPlaceholderText('Your Review')).toHaveValue('An existing review');
    });

    // Accessibility Test
    expect.extend(toHaveNoViolations);

    it('is accessible', async () => {
        const { container } = renderComponent();
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // Warning Test
    it('shows warning if user is not logged in and tries to edit', () => {
        renderComponent();
        const input = screen.getByPlaceholderText('Your Review');
        fireEvent.focus(input);
        expect(screen.getByText('Please log in to manage ratings.')).toBeInTheDocument();
    });

    // Error Handling Test
    it('shows error message if submission fails', async () => {
        // Mock a failed submission by intercepting the dispatch call and simulating an error.
        const customInitialState = {
            ...initialState,
            auth: {
                user: { email: 'test@example.com' },
                error: 'Submission failed'
            },
            user: {
                userId: 'user1'
            }
        };
        renderComponent(customInitialState);
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('Submission failed')).toBeInTheDocument();
        });
    });
});
