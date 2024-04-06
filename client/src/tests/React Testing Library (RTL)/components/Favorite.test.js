import React from 'react';
import { render, screen } from '@testing-library/react';
import FavoriteComponent from '../../components/Favorite';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Configure the mock store with middlewares
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Extend expect for accessibility checks
expect.extend(toHaveNoViolations);

describe('FavoriteComponent Tests', () => {
    // Define the initial state of the Redux store
    const initialState = {
        favorites: { items: [{ movie_id: 'testMovieId', type: 'movie' }] },
        auth: { user: true },
        user: { userId: 'testUserId' }
    };
    const store = mockStore(initialState);

    // Render Test
    it('renders correctly', () => {
        render(
            <Provider store={store}>
                <FavoriteComponent movieId="testMovieId" type="movie" size="small" />
            </Provider>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    // Props Test
    it('renders with correct size prop', () => {
        render(
            <Provider store={store}>
                <FavoriteComponent movieId="testMovieId" type="movie" size="large" />
            </Provider>
        );
        expect(screen.getByRole('button')).toHaveClass('MuiIconButton-sizeLarge');
    });

    // Interaction Test
    it('toggles favorite status on click', async () => {
        render(
            <Provider store={store}>
                <FavoriteComponent movieId="testMovieId" type="movie" size="small" />
            </Provider>
        );
        const button = screen.getByRole('button');
        await userEvent.click(button);
        // Further actions to verify the state change or dispatched actions would be dependent on mocking the Redux store or spying on dispatch calls.
    });

    // Accessibility Test
    it('is accessible', async () => {
        const { container } = render(
            <Provider store={store}>
                <FavoriteComponent movieId="testMovieId" type="movie" size="small" />
            </Provider>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // Edge Case Test
    // Edge Case Test
    it('handles no user being logged in', () => {
        const noUserState = {
            ...initialState,
            auth: { user: null },
        };
        const noUserStore = mockStore(noUserState);
        render(
            <Provider store={noUserStore}>
                <FavoriteComponent movieId="testMovieId" type="movie" size="small" />
            </Provider>
        );
        // Verify that appropriate UI changes or warnings are displayed when no user is logged in
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Login to favorite');
        expect(button).toBeDisabled();
    });


    // Additional tests for State Test, Effect Test, and Error Handling Test would require further implementation details and potentially mocking or spying on Redux hooks and state.
});
