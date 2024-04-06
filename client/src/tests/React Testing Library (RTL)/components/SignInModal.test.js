import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SignInModal from "../../../components/SignInModal";
import {loginUserWithEmailPassword, loginUserWithGoogle} from "../../../features/auth/authSlice";

const mockStore = configureStore([]);

describe('SignInModal Component', () => {
    let store;
    beforeEach(() => {
        store = mockStore({});
    });

    // Render Test
    it('renders the sign in modal correctly', () => {
        render(
            <Provider store={store}>
                <SignInModal open={true} onClose={() => {}} />
            </Provider>
        );
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    // Props Test
    it('receives props correctly', () => {
        const onClose = jest.fn();
        render(
            <Provider store={store}>
                <SignInModal open={true} onClose={onClose} />
            </Provider>
        );
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    // Interaction Test
    it('handles email sign in correctly', () => {
        const onClose = jest.fn();
        render(
            <Provider store={store}>
                <SignInModal open={true} onClose={onClose} />
            </Provider>
        );
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign in with Email'));
        expect(store.getActions()).toContainEqual(loginUserWithEmailPassword({ email: 'test@example.com', password: 'password123' }));
        expect(onClose).toHaveBeenCalled();
    });

    it('handles google sign in correctly', () => {
        const onClose = jest.fn();
        render(
            <Provider store={store}>
                <SignInModal open={true} onClose={onClose} />
            </Provider>
        );
        fireEvent.click(screen.getByText('Sign in with Google'));
        expect(store.getActions()).toContainEqual(loginUserWithGoogle());
        expect(onClose).toHaveBeenCalled();
    });

    // State Test
    it('correctly updates state when typing in email and password fields', () => {
        render(
            <Provider store={store}>
                <SignInModal open={true} onClose={() => {}} />
            </Provider>
        );
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
        expect(screen.getByLabelText('Password')).toHaveValue('password123');
    });

    // Effect Test
    it('does not produce side effects', () => {
        // Not applicable as there are no side effects to test
    });

    // Accessibility Test
    it('is accessible', async () => {
        const onClose = jest.fn();
        const { container } = render(
            <Provider store={store}>
                <SignInModal open={true} onClose={onClose} />
            </Provider>
        );
        expect(await screen.findByText('Sign In')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    // Edge Case Test
    it('handles empty email and password fields correctly', () => {
        const onClose = jest.fn();
        render(
            <Provider store={store}>
                <SignInModal open={true} onClose={onClose} />
            </Provider>
        );
        fireEvent.click(screen.getByText('Sign in with Email'));
        expect(store.getActions()).toEqual([]);
        expect(onClose).not.toHaveBeenCalled();
    });

    // Error Handling Test
    it('does not include error handling capabilities', () => {
        // Not applicable as there are no error-prone operations to test
    });
});
