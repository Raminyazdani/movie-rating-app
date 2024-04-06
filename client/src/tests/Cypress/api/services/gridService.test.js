// Cypress test file: .\src\tests\Cypress\api\services\gridService.test.js

// Importing the getMovieGrid function from the gridService module
import { getMovieGrid } from "../../../../api/services/gridService";

// Mock data for testing
const mockTrendingResponse = {
    data: {
        results: [
            { id: 1, title: 'Movie 1', media_type: 'movie' },
            { id: 2, name: 'TV Show 1', media_type: 'tv' },
            // Add more mock data as needed
        ],
    },
};

const mockSimilarResponse = {
    data: {
        results: [
            { id: 1, title: 'Similar Movie 1', media_type: 'movie' },
            { id: 2, name: 'Similar TV Show 1', media_type: 'tv' },
            // Add more mock data as needed
        ],
    },
};

// Mocking the TBDBapi get function
const mockGet = cy.stub();

// Stubbing the TBDBapi module
cy.stub(window, 'TBDBapi').callsFake(() => ({
    get: mockGet,
}));

// POST Request Test (Not applicable for getMovieGrid)

// PUT Request Test (Not applicable for getMovieGrid)

// DELETE Request Test (Not applicable for getMovieGrid)

// GET Request Test
describe('GET Request Test', () => {
    it('successfully makes a GET request to TBDB API for trending movies or TV shows', async () => {
        // Mock the TBDBapi get function to resolve with trending data
        mockGet.withArgs('/trending/all/day', { params: { language: 'en-US', page: 1 } }).resolves(mockTrendingResponse);

        // Call the getMovieGrid function with appropriate parameters
        const result = await getMovieGrid('all', 'day', 1);

        // Ensure the TBDBapi.get function is called with the correct endpoint and parameters
        // Ensure the returned data contains detailed information about trending movies or TV shows
        expect(mockGet).to.be.calledWith('/trending/all/day', { params: { language: 'en-US', page: 1 } });
        expect(result).to.deep.equal([
            { id: 1, title: 'Movie 1', type: 'movie', details: null },
            { id: 2, name: 'TV Show 1', type: 'tv', details: null },
        ]);
    });

    it('successfully makes a GET request to TBDB API for similar movies or TV shows', async () => {
        // Mock the TBDBapi get function to resolve with similar data
        mockGet.withArgs('/movie/1234/similar', { params: { language: 'en-US', page: 1 } }).resolves(mockSimilarResponse);

        // Call the getMovieGrid function with appropriate parameters
        const result = await getMovieGrid('movie', 'similar', 1, 1234);

        // Ensure the TBDBapi.get function is called with the correct endpoint and parameters
        // Ensure the returned data contains detailed information about similar movies or TV shows
        expect(mockGet).to.be.calledWith('/movie/1234/similar', { params: { language: 'en-US', page: 1 } });
        expect(result).to.deep.equal([
            { id: 1, title: 'Similar Movie 1', type: 'movie', details: null },
            { id: 2, name: 'Similar TV Show 1', type: 'tv', details: null },
        ]);
    });
});

// Response Status Test (Not applicable for getMovieGrid)

// Response Body Test (Not applicable for getMovieGrid)

// Error Handling Test
describe('Error Handling Test', () => {
    it('handles errors correctly', async () => {
        // Mock the TBDBapi get function to reject with an error
        mockGet.rejects(new Error('Failed to fetch data'));

        // Call the getMovieGrid function with appropriate parameters
        const result = await getMovieGrid('all', 'day', 1);

        // Ensure the function returns an empty array when an error occurs
        expect(result).to.be.an('array').that.is.empty;
    });
});
