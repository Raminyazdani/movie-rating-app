const request = require('supertest');
const express = require('express');
const ratingsRoutes = require('../routes/ratingsRoutes');
const ratingsController = require('../controllers/ratingsController');

// Mocking the ratingsController methods
jest.mock('../controllers/ratingsController', () => ({
    fetchRatings: jest.fn(),
    addOrUpdateRating: jest.fn(),
    removeRating: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/ratings', ratingsRoutes);

describe('Ratings Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /ratings/:userId should call ratingsController.fetchRatings', async () => {
        ratingsController.fetchRatings.mockResolvedValueOnce([{ movie_id: 123, rating: 4, type: 'movie' }]);
        const response = await request(app).get('/ratings/1');
        expect(ratingsController.fetchRatings).toHaveBeenCalledWith({ params: { userId: '1' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ 123: { rating: 4, type: 'movie' } }]);
    });

    it('POST /ratings should call ratingsController.addOrUpdateRating', async () => {
        ratingsController.addOrUpdateRating.mockResolvedValueOnce([{ movie_id: 123, rating: 4, type: 'movie' }]);
        const response = await request(app).post('/ratings').send({ userId: 1, movieId: 123, rating: 4, type: 'movie' });
        expect(ratingsController.addOrUpdateRating).toHaveBeenCalledWith({ body: { userId: 1, movieId: 123, rating: 4, type: 'movie' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ 123: { rating: 4, type: 'movie' } }]);
    });

    it('DELETE /ratings/:userId/:movieId/:type should call ratingsController.removeRating', async () => {
        ratingsController.removeRating.mockResolvedValueOnce([{ movie_id: 123, rating: 4, type: 'movie' }]);
        const response = await request(app).delete('/ratings/1/123/movie');
        expect(ratingsController.removeRating).toHaveBeenCalledWith({ params: { userId: '1', movieId: '123', type: 'movie' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ 123: { rating: 4, type: 'movie' } }]);
    });
});
