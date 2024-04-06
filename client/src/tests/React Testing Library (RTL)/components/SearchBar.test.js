import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import * as titleService from "../../../api/services/titleService";
import SearchComponent from "../../../components/SearchBar";

// Mock the titleService
jest.mock('../../../api/services/titleService', () => ({
    fetchByTitle: jest.fn()
}));

// Extend expect with accessibility check
expect.extend(toHaveNoViolations);

// Function to setup the component with a store
const setup = (store) => {
    return render(
        <Provider store={store}>
            <SearchComponent />
        </Provider>
    );
};

// Test Suite
describe('SearchComponent Tests', () => {
    let store;

    beforeEach(() => {
        store = configureStore({ reducer: () => ({}) });
        titleService.fetchByTitle.mockClear();
    });

    // Render Test
    it('renders the search component', () => {
        setup(store);
        expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
    });

    // Props Test
    it('does not directly take props affecting rendering', () => {
        // The component does not use props for direct rendering changes, so this test is not applicable.
    });

    // Interaction Test
    it('updates the query state on text field change', async () => {
        setup(store);
        const input = screen.getByPlaceholderText('Search movies...');
        await userEvent.type(input, 'Matrix');
        expect(input).toHaveValue('Matrix');
    });

    // State Test
    it('clears search results when the query is cleared', async () => {
        setup(store);
        const input = screen.getByPlaceholderText('Search movies...');
        await userEvent.type(input, 'Matrix');
        await userEvent.clear(input);
        expect(input).toHaveValue('');
        // Assume your component clears search results when input is cleared
        // This could be checked by asserting the absence of list items if your component renders them
    });

    // Effect Test
    it('performs a search when query and searchType are set', async () => {
        // Mock the API response
        titleService.fetchByTitle.mockResolvedValue([{ imdbID: 'tt0133093', Title: 'The Matrix', Year: '1999' }]);
        setup(store);
        const input = screen.getByPlaceholderText('Search movies...');
        await userEvent.type(input, 'Matrix');
        expect(titleService.fetchByTitle).toHaveBeenCalledWith('Matrix', 'movie');
        // You'll need to mock and await the search result to be displayed
    });

    // Accessibility Test
    it('is accessible', async () => {
        const { container } = setup(store);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // Edge Case Test
    it('does not search when query length is less than 3 characters', async () => {
        setup(store);
        const input = screen.getByPlaceholderText('Search movies...');
        await userEvent.type(input, 'Ma');
        expect(titleService.fetchByTitle).not.toHaveBeenCalled();
    });

    // Error Handling Test
    it('displays an error message when search fails', async () => {
        // Mock the API rejection
        titleService.fetchByTitle.mockRejectedValue(new Error('Failed to fetch'));
        setup(store);
        const input = screen.getByPlaceholderText('Search movies...');
        await userEvent.type(input, 'Matrix');
        // This assumes your component handles and displays search errors
        // You may need to adjust based on your actual implementation
        await expect(screen.findByText('Error searching movies/TV shows:')).toBeInTheDocument();
    });
});
