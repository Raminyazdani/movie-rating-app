// Cypress test file: .\src\tests\Cypress\api\clients\apiMovieTMDB.test.js

// Importing axios and the TBDBapi instance
import axios from "axios";
import { TBDBapi } from "../../../../api/clients/apiMovieTMDB";

// GET Request Test
describe('GET Request Test', () => {
    it('successfully makes a GET request to TMDB API', () => {
        // Make a GET request to the TMDB API
        // Ensure the request is successful (status code 200)
        cy.request({
            method: 'GET',
            url: 'https://api.themoviedb.org/3',
            qs: {
                api_key: Cypress.env('REACT_APP_TMDB_API_KEY')
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

// POST Request Test
describe('POST Request Test', () => {
    it('successfully makes a POST request to TMDB API', () => {
        // Make a sample POST request to the TMDB API
        // Ensure the request is successful (status code 200)
        TBDBapi.post('/movie', { title: 'Interstellar' }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

// PUT Request Test
describe('PUT Request Test', () => {
    it('successfully makes a PUT request to TMDB API', () => {
        // Make a sample PUT request to the TMDB API
        // Ensure the request is successful (status code 200)
        TBDBapi.put('/movie/123', { title: 'Updated Title' }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

// DELETE Request Test
describe('DELETE Request Test', () => {
    it('successfully makes a DELETE request to TMDB API', () => {
        // Make a sample DELETE request to the TMDB API
        // Ensure the request is successful (status code 200)
        TBDBapi.delete('/movie/123').then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

// Response Status Test
describe('Response Status Test', () => {
    it('ensures response status is correct', () => {
        // Make a sample GET request to the TMDB API
        // Ensure the response status is correct (e.g., 200 OK)
        TBDBapi.get('/movie/550').then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

// Response Body Test
describe('Response Body Test', () => {
    it('ensures response body is correct', () => {
        // Make a sample GET request to the TMDB API
        // Ensure the response body contains expected data
        TBDBapi.get('/movie/550').then((response) => {
            expect(response.data.title).to.eq('Fight Club');
        });
    });
});

// Error Handling Test
describe('Error Handling Test', () => {
    it('handles errors correctly', () => {
        // Make a sample GET request to the TMDB API with invalid parameters
        // Ensure the response status indicates an error (e.g., 400 Bad Request)
        TBDBapi.get('/movie/invalid_id').catch((error) => {
            expect(error.response.status).to.eq(400);
        });
    });
});
