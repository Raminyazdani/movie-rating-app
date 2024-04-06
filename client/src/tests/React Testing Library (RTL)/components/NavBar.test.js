import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import NavBar from '../components/NavBar';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend expect for accessibility checks
expect.extend(toHaveNoViolations);

// Setup Redux store for tests
const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    preloadedState: {
        auth: {
            user: null,
            status: 'idle',
            error: null,
        },
    },
});

describe('NavBar Component Tests', () => {
    // Render Test
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <NavBar />
            </Provider>
        );
        expect(screen.getByText('Movie Rater')).toBeInTheDocument();
    });

    // Interaction Test - Opens sign-in modal
    it('opens sign-in modal on button click', () => {
        render(
            <Provider store={store}>
                <NavBar />
            </Provider>
        );
        fireEvent.click(screen.getByText('Sign In'));
        expect(screen.getByRole('presentation')).toBeVisible(); // Assuming your modal has a role of 'presentation'
    });

    // State Test - Verifies if the sign-in modal opens
    it('changes state to show sign-in modal', async () => {
        render(
            <Provider store={store}>
                <NavBar />
            </Provider>
        );
        fireEvent.click(screen.getByText('Sign In'));
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());
    });

    // Effect Test - Mock user sign-out and verify snackbar appearance
    it('shows snackbar on sign out', async () => {
        // Mock initial state as a logged-in user
        const customStore = configureStore({
            reducer: {
                auth: authReducer,
            },
            preloadedState: {
                auth: {
                    user: { email: 'test@example.com' },
                    status: 'idle',
                    error: null,
                },
            },
        });

        render(
            <Provider store={customStore}>
                <NavBar />
            </Provider>
        );
        fireEvent.click(screen.getByText('Sign Out'));
        await waitFor(() => expect(screen.getByText('Logged out successfully')).toBeInTheDocument());
    });

    // Accessibility Test
    it('is accessible', async () => {
        const { container } = render(
            <Provider store={store}>
                <NavBar />
            </Provider>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // Edge Case Test - Handling no user state
    it('displays Sign In and Sign Up when no user is logged in', () => {
        render(
            <Provider store={store}>
                <NavBar />
            </Provider>
        );
        expect(screen.getByText('Sign In')).toBeVisible();
        expect(screen.getByText('Sign Up')).toBeVisible();
    });

    // Error Handling Test - Simulate auth error and verify UI response
    it('handles authentication error gracefully', async () => {
        const customStore = configureStore({
            reducer: {
                auth: authReducer,
            },
            preloadedState: {
                auth: {
                    user: null,
                    status: 'failed',
                    error: 'Authentication failed',
                },
            },
        });

        render(
            <Provider store={customStore}>
                <NavBar />
            </Provider>
        );

        fireEvent.click(screen.getByText('Sign In'));
        await waitFor(() => expect(screen.getByText(/Authentication failed/)).toBeInTheDocument());
    });
});
