// Cypress test file: .\src\tests\Cypress\api\helpers\normalizeData.test.js

// Importing the normalizeData function from the normalizeData module
import { normalizeData } from "../../../../api/helpers/normalizeData";

// Sample data for testing
const sampleMovieData = {
    poster_path: '/sample_poster.jpg',
    title: 'Sample Movie',
    release_date: '2022-01-01',
    id: 123456,
    genres: [{ name: 'Action' }, { name: 'Adventure' }],
    vote_average: 8.5,
    overview: 'Sample movie plot.',
};

const sampleTVShowData = {
    poster_path: '/sample_poster.jpg',
    name: 'Sample TV Show',
    first_air_date: '2022-01-01',
    id: 789012,
    genres: [{ name: 'Drama' }, { name: 'Thriller' }],
    vote_average: 9.0,
    overview: 'Sample TV show plot.',
};

// GET Request Test (Not applicable for normalizeData)

// POST Request Test (Not applicable for normalizeData)

// PUT Request Test (Not applicable for normalizeData)

// DELETE Request Test (Not applicable for normalizeData)

// Response Status Test (Not applicable for normalizeData)

// Response Body Test
describe('Response Body Test', () => {
    it('correctly normalizes movie data', () => {
        // Call the normalizeData function with sample movie data
        // Ensure the returned object contains the normalized values
        const normalizedData = normalizeData(sampleMovieData, 'movie');
        expect(normalizedData).to.deep.equal({
            Poster: 'https://image.tmdb.org/t/p/w500/sample_poster.jpg',
            Title: 'Sample Movie',
            Year: '2022',
            imdbID: '123456',
            Type: 'movie',
            Genre: 'Action, Adventure',
            imdbRating: '8.5',
            Plot: 'Sample movie plot.',
        });
    });

    it('correctly normalizes TV show data', () => {
        // Call the normalizeData function with sample TV show data
        // Ensure the returned object contains the normalized values
        const normalizedData = normalizeData(sampleTVShowData, 'tv');
        expect(normalizedData).to.deep.equal({
            Poster: 'https://image.tmdb.org/t/p/w500/sample_poster.jpg',
            Title: 'Sample TV Show',
            Year: '2022',
            imdbID: '789012',
            Type: 'tv',
            Genre: 'Drama, Thriller',
            imdbRating: '9.0',
            Plot: 'Sample TV show plot.',
        });
    });
});

// Error Handling Test (Not applicable for normalizeData)
