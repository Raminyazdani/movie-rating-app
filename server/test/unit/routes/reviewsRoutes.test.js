const request = require('supertest');
const express = require('express');
const reviewsRoutes = require('../routes/reviewsRoutes');
const reviewsController = require('../controllers/reviewsController');

// Mocking the reviewsController methods
jest.mock('../controllers/reviewsController', () => ({
    addOrUpdateReview: jest.fn(),
    getReviews: jest.fn(),
    deleteReview: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/reviews', reviewsRoutes);

describe('Reviews Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('POST /reviews should call reviewsController.addOrUpdateReview', async () => {
        reviewsController.addOrUpdateReview.mockResolvedValueOnce([{ movie_id: 123, review: 'Great movie', type: 'movie' }]);
        const response = await request(app).post('/reviews').send({ userId: 1, movieId: 123, review: 'Great movie', type: 'movie' });
        expect(reviewsController.addOrUpdateReview).toHaveBeenCalledWith({ body: { userId: 1, movieId: 123, review: 'Great movie', type: 'movie' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ movie_id: 123, review: 'Great movie', type: 'movie' }]);
    });

    it('GET /reviews should call reviewsController.getReviews', async () => {
        reviewsController.getReviews.mockResolvedValueOnce([{ movie_id: 123, review: 'Great movie', type: 'movie' }]);
        const response = await request(app).get('/reviews');
        expect(reviewsController.getReviews).toHaveBeenCalledWith(expect.objectContaining({ query: {} }), expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ movie_id: 123, review: 'Great movie', type: 'movie' }]);
    });

    it('DELETE /reviews/:userId/:movieId/:type should call reviewsController.deleteReview', async () => {
        reviewsController.deleteReview.mockResolvedValueOnce({ message: 'Review deleted successfully' });
        const response = await request(app).delete('/reviews/1/123/movie');
        expect(reviewsController.deleteReview).toHaveBeenCalledWith({ params: { userId: '1', movieId: '123', type: 'movie' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Review deleted successfully' });
    });
});
