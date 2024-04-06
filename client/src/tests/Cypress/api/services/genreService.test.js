// Cypress test file: .\src\tests\Cypress\api\services\genreService.test.js

// Importing the fetchAllGenresAndMemoize function from the genreService module
import { fetchAllGenresAndMemoize } from "../../../../api/services/genreService";

// Mock data for testing
const mockMovieGenresResponse = {
    data: {
        genres: [
            { id: 1, name: 'Action' },
            { id: 2, name: 'Adventure' },
            // Add more genres as needed
        ],
    },
};

const mockTVGenresResponse = {
    data: {
        genres: [
            { id: 1, name: 'Drama' },
            { id: 2, name: 'Comedy' },
            // Add more genres as needed
        ],
    },
};

// Mocking the TBDBapi get function
const mockGet = cy.stub();

// Stubbing the TBDBapi module
cy.stub(window, 'TBDBapi').callsFake(() => ({
    get: mockGet,
}));

// POST Request Test (Not applicable for fetchAllGenresAndMemoize)

// PUT Request Test (Not applicable for fetchAllGenresAndMemoize)

// DELETE Request Test (Not applicable for fetchAllGenresAndMemoize)

// GET Request Test
describe('GET Request Test', () => {
    it('successfully makes a GET request to TBDB API for movie genres', async () => {
        // Mock the TBDBapi get function to resolve with movie genres data
        mockGet.withArgs('/genre/movie/list', { params: { language: 'en-US' } }).resolves(mockMovieGenresResponse);

        // Call the fetchAllGenresAndMemoize function
        const result = await fetchAllGenresAndMemoize();

        // Ensure the TBDBapi.get function is called with the correct endpoint and parameters
        // Ensure the localStorage.setItem function is called with the correct key and data
        // Ensure the returned data contains movie genres
        expect(mockGet).to.be.calledWith('/genre/movie/list', { params: { language: 'en-US' } });
        expect(localStorage.getItem('tmdbMovieGenres')).to.equal(JSON.stringify(mockMovieGenresResponse.data.genres));
        expect(result.movieGenres).to.deep.equal(mockMovieGenresResponse.data.genres);
    });

    it('successfully makes a GET request to TBDB API for TV genres', async () => {
        // Mock the TBDBapi get function to resolve with TV genres data
        mockGet.withArgs('/genre/tv/list', { params: { language: 'en-US' } }).resolves(mockTVGenresResponse);

        // Call the fetchAllGenresAndMemoize function
        const result = await fetchAllGenresAndMemoize();

        // Ensure the TBDBapi.get function is called with the correct endpoint and parameters
        // Ensure the localStorage.setItem function is called with the correct key and data
        // Ensure the returned data contains TV genres
        expect(mockGet).to.be.calledWith('/genre/tv/list', { params: { language: 'en-US' } });
        expect(localStorage.getItem('tmdbTVGenres')).to.equal(JSON.stringify(mockTVGenresResponse.data.genres));
        expect(result.tvGenres).to.deep.equal(mockTVGenresResponse.data.genres);
    });
});

// Response Status Test (Not applicable for fetchAllGenresAndMemoize)

// Response Body Test (Not applicable for fetchAllGenresAndMemoize)

// Error Handling Test
describe('Error Handling Test', () => {
    it('handles errors correctly', async () => {
        // Mock the TBDBapi get function to reject with an error
        mockGet.rejects(new Error('Failed to fetch data'));

        // Call the fetchAllGenresAndMemoize function
        const result = await fetchAllGenresAndMemoize();

        // Ensure the function returns empty arrays for both movieGenres and tvGenres
        expect(result.movieGenres).to.be.an('array').that.is.empty;
        expect(result.tvGenres).to.be.an('array').that.is.empty;
    });
});
