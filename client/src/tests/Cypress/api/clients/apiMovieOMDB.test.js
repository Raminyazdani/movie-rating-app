// Cypress test file: .\src\tests\Cypress\api\clients\apiMovieOMDB.test.js

// Importing axios and the OMDBapi instance
import axios from "axios";
import { OMDBapi } from "../../../../api/clients/apiMovieOMDB";

// GET Request Test
describe('GET Request Test', () => {
    it('successfully makes a GET request to OMDB API', () => {
        // Make a GET request to the OMDB API
        // Ensure the request is successful (status code 200)
        cy.request({
            method: 'GET',
            url: 'http://www.omdbapi.com',
            qs: {
                apikey: Cypress.env('REACT_APP_OMDB_API_KEY')
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

// POST Request Test (Not applicable as OMDB API does not support POST requests)

// PUT Request Test (Not applicable as OMDB API does not support PUT requests)

// DELETE Request Test (Not applicable as OMDB API does not support DELETE requests)

// Response Status Test
describe('Response Status Test', () => {
    it('ensures response status is correct', () => {
        // Make a sample GET request to the OMDB API
        // Ensure the response status is correct (e.g., 200 OK)
        OMDBapi.get('/', { params: { t: 'Titanic' } }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

// Response Body Test
describe('Response Body Test', () => {
    it('ensures response body is correct', () => {
        // Make a sample GET request to the OMDB API
        // Ensure the response body contains expected data
        OMDBapi.get('/', { params: { t: 'Titanic' } }).then((response) => {
            expect(response.data.Title).to.eq('Titanic');
        });
    });
});

// Error Handling Test
describe('Error Handling Test', () => {
    it('handles errors correctly', () => {
        // Make a sample GET request to the OMDB API with invalid parameters
        // Ensure the response status indicates an error (e.g., 400 Bad Request)
        OMDBapi.get('/', { params: { invalid_param: 'invalid_value' } }).catch((error) => {
            expect(error.response.status).to.eq(400);
        });
    });
});
