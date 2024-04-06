// Cypress test file: .\src\tests\Cypress\api\services\detailandmemoService.test.js

// Importing the fetchDetailsAndMemoize function from the detailandmemoService module
import { fetchDetailsAndMemoize } from "../../../../api/services/detailandmemoService";

// Mock data for testing
const mockMovieResponse = {
    data: {
        id: 1,
        title: 'Movie Title',
        type: 'movie',
        // Add other relevant properties for a movie response
    },
};

const mockTVResponse = {
    data: {
        id: 2,
        name: 'TV Show Name',
        type: 'tv',
        // Add other relevant properties for a TV show response
    },
};

// Mocking the TBDBapi get function
const mockGet = cy.stub();

// Stubbing the TBDBapi module
cy.stub(window, 'TBDBapi').callsFake(() => ({
    get: mockGet,
}));

// Stubbing the localStorageService module
const mockLocalStorageService = {
    get: cy.stub(),
    set: cy.stub(),
};

// Stubbing the normalizeData function
const mockNormalizeData = cy.stub();

// POST Request Test (Not applicable for fetchDetailsAndMemoize)

// PUT Request Test (Not applicable for fetchDetailsAndMemoize)

// DELETE Request Test (Not applicable for fetchDetailsAndMemoize)

// GET Request Test
describe('GET Request Test', () => {
    it('successfully makes a GET request to TBDB API for a movie', async () => {
        // Mock the TBDBapi get function to resolve with movie data
        mockGet.resolves(mockMovieResponse);
        mockNormalizeData.returnsArg(0); // Stub normalizeData to return the same data
        mockLocalStorageService.get.returns(null); // Stub localStorageService.get to return null (no memoized data)

        // Call the fetchDetailsAndMemoize function with movie ID and type 'movie'
        const result = await fetchDetailsAndMemoize(1, 'movie');

        // Ensure the TBDBapi.get function is called with the correct endpoint and parameters
        // Ensure the normalizeData function is called with the correct response data and type
        // Ensure the localStorageService.set function is called with the correct storage key and data
        expect(mockGet).to.be.calledWith('/movie/1', { params: { append_to_response: 'credits' } });
        expect(mockNormalizeData).to.be.calledWith(mockMovieResponse.data, 'movie');
        expect(mockLocalStorageService.set).to.be.calledWith('details-movie-1', JSON.stringify(mockMovieResponse.data));
        // Add more assertions as needed
    });

    it('successfully makes a GET request to TBDB API for a TV show', async () => {
        // Mock the TBDBapi get function to resolve with TV show data
        mockGet.resolves(mockTVResponse);
        mockNormalizeData.returnsArg(0); // Stub normalizeData to return the same data
        mockLocalStorageService.get.returns(null); // Stub localStorageService.get to return null (no memoized data)

        // Call the fetchDetailsAndMemoize function with TV show ID and type 'tv'
        const result = await fetchDetailsAndMemoize(2, 'tv');

        // Ensure the TBDBapi.get function is called with the correct endpoint and parameters
        // Ensure the normalizeData function is called with the correct response data and type
        // Ensure the localStorageService.set function is called with the correct storage key and data
        expect(mockGet).to.be.calledWith('/tv/2', { params: { append_to_response: 'credits' } });
        expect(mockNormalizeData).to.be.calledWith(mockTVResponse.data, 'tv');
        expect(mockLocalStorageService.set).to.be.calledWith('details-tv-2', JSON.stringify(mockTVResponse.data));
        // Add more assertions as needed
    });
});

// Response Status Test (Not applicable for fetchDetailsAndMemoize)

// Response Body Test
describe('Response Body Test', () => {
    it('correctly returns the normalized data for a movie', async () => {
        // Stub the localStorageService.get function to return null (no memoized data)
        mockLocalStorageService.get.returns(null);
        // Stub the TBDBapi get function to resolve with movie data
        mockGet.resolves(mockMovieResponse);
        // Stub the normalizeData function to return the same data
        mockNormalizeData.returnsArg(0);

        // Call the fetchDetailsAndMemoize function with movie ID and type 'movie'
        const result = await fetchDetailsAndMemoize(1, 'movie');

        // Ensure the returned data matches the expected movie data
        expect(result).to.deep.equal(mockMovieResponse.data);
    });

    it('correctly returns the normalized data for a TV show', async () => {
        // Stub the localStorageService.get function to return null (no memoized data)
        mockLocalStorageService.get.returns(null);
        // Stub the TBDBapi get function to resolve with TV show data
        mockGet.resolves(mockTVResponse);
        // Stub the normalizeData function to return the same data
        mockNormalizeData.returnsArg(0);

        // Call the fetchDetailsAndMemoize function with TV show ID and type 'tv'
        const result = await fetchDetailsAndMemoize(2, 'tv');

        // Ensure the returned data matches the expected TV show data
        expect(result).to.deep.equal(mockTVResponse.data);
    });
});

// Error Handling Test
describe('Error Handling Test', () => {
    it('handles errors correctly', async () => {
        // Stub the localStorageService.get function to return null (no memoized data)
        mockLocalStorageService.get.returns(null);
        // Mock the TBDBapi get function to reject with an error
        mockGet.rejects(new Error('Failed to fetch data'));

        // Call the fetchDetailsAndMemoize function with invalid ID and type
        const result = await fetchDetailsAndMemoize(-1, 'invalidType');

        // Ensure the function returns null when an error occurs
        expect(result).to.be.null;
    });
});
