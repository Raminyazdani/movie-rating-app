// Cypress test file: .\src\tests\Cypress\api\services\carouselService.test.js

// Importing the getMovieCarousel function from the carouselService module
import { getMovieCarousel } from "../../../../api/services/carouselService";

// Sample data for testing
const mockResponseData = {
    results: [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
        { id: 3, title: 'Movie 3' },
    ],
};

// Mocking the TBDBapi get function
const mockGet = cy.stub().resolves({ data: mockResponseData });

// Mocking the fetchDetailsAndMemoize function
const mockFetchDetailsAndMemoize = cy.stub().resolves([
    { id: 1, title: 'Movie 1', type: 'movie' },
    { id: 2, title: 'Movie 2', type: 'movie' },
    { id: 3, title: 'Movie 3', type: 'movie' },
]);

// Stubbing the TBDBapi module
cy.stub(window, 'TBDBapi').callsFake(() => ({
    get: mockGet,
}));

// GET Request Test
describe('GET Request Test', () => {
    it('successfully makes a GET request to TBDB API', () => {
        // Call the getMovieCarousel function with a valid type
        // Ensure the TBDBapi.get function is called with the correct endpoint and parameters
        // Ensure the fetchDetailsAndMemoize function is called with the correct movie IDs
        getMovieCarousel('now_playing');
        cy.wrap(mockGet).should('be.calledWith', '/movie/now_playing', {
            params: { language: 'en-US', page: 1 },
        });
        cy.wrap(mockFetchDetailsAndMemoize).should('be.calledWith', 1, 'movie');
        cy.wrap(mockFetchDetailsAndMemoize).should('be.calledWith', 2, 'movie');
        cy.wrap(mockFetchDetailsAndMemoize).should('be.calledWith', 3, 'movie');
    });
});

// POST Request Test (Not applicable for getMovieCarousel)

// PUT Request Test (Not applicable for getMovieCarousel)

// DELETE Request Test (Not applicable for getMovieCarousel)

// Response Status Test (Not applicable for getMovieCarousel)

// Response Body Test
describe('Response Body Test', () => {
    it('correctly returns the movies with type', async () => {
        // Call the getMovieCarousel function with a valid type
        // Ensure the returned data contains the correct movie details with type
        const movies = await getMovieCarousel('now_playing');
        expect(movies).to.deep.equal([
            { id: 1, title: 'Movie 1', type: 'movie' },
            { id: 2, title: 'Movie 2', type: 'movie' },
            { id: 3, title: 'Movie 3', type: 'movie' },
        ]);
    });
});

// Error Handling Test
describe('Error Handling Test', () => {
    it('handles errors correctly', async () => {
        // Mock the TBDBapi get function to reject with an error
        mockGet.rejects(new Error('Failed to fetch data'));

        // Call the getMovieCarousel function with a valid type
        // Ensure it returns an empty array when an error occurs
        const movies = await getMovieCarousel('now_playing');
        expect(movies).to.deep.equal([]);
    });
});
