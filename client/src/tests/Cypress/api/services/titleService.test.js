// Cypress test file: .\src\tests\Cypress\api\services\titleService.test.js

// Importing the TBDBapi and fetchDetailsAndMemoize functions
import { TBDBapi } from "../../../../api/clients/apiMovieTMDB";
import { fetchDetailsAndMemoize } from "../../../../api/services/detailandmemoService";

// Importing the fetchByTitle function to be tested
import { fetchByTitle } from "../../../../api/services/titleService";

// Mock data for testing
const mockMovieResponse = { id: 123, title: "Test Movie", type: "movie" };
const mockTvResponse = { id: 456, name: "Test TV Show", type: "tv" };

// Mocking the TBDBapi get function
const mockGet = cy.stub(TBDBapi, 'get');

// Stubbing the fetchDetailsAndMemoize function
cy.stub(window, 'fetchDetailsAndMemoize').resolves({ id: 123, title: "Test Movie", type: "movie" });

// GET Request Test
describe('GET Request Test', () => {
    it('successfully makes a GET request for both movies and TV shows', async () => {
        // Mocking the TBDBapi get function for movie search
        mockGet.withArgs('/search/movie', { params: { query: 'Test', language: 'en-US' } }).resolves({ data: { results: [mockMovieResponse] } });

        // Mocking the TBDBapi get function for TV show search
        mockGet.withArgs('/search/tv', { params: { query: 'Test', language: 'en-US' } }).resolves({ data: { results: [mockTvResponse] } });

        // Call the fetchByTitle function
        const result = await fetchByTitle('Test', 'all');

        // Ensure TBDBapi.get is called with the correct endpoints and parameters
        expect(mockGet).to.be.calledWith('/search/movie', { params: { query: 'Test', language: 'en-US' } });
        expect(mockGet).to.be.calledWith('/search/tv', { params: { query: 'Test', language: 'en-US' } });

        // Ensure the returned data contains the expected movie and TV show responses
        expect(result).to.deep.equal([mockMovieResponse, mockTvResponse]);
    });
});

// POST Request Test
// Not applicable as the titleService does not include POST functionality.

// PUT Request Test
// Not applicable as the titleService does not include PUT functionality.

// DELETE Request Test
// Not applicable as the titleService does not include DELETE functionality.

// Response Status Test
// Not applicable as response status testing is not relevant to this service.

// Response Body Test
// Not applicable as response body testing is not relevant to this service.

// Error Handling Test
describe('Error Handling Test', () => {
    it('handles errors correctly', async () => {
        // Mocking the TBDBapi get function to throw an error
        mockGet.throws(new Error('Failed to fetch data'));

        // Call the fetchByTitle function
        const result = await fetchByTitle('Test', 'all');

        // Ensure the function returns an empty array when an error occurs
        expect(result).to.be.an('array').that.is.empty;
    });
});
