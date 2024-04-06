const request = require('supertest');
const express = require('express');
const recommendationsRoutes = require('../routes/recommendationsRoutes');
const recommendationsController = require('../controllers/recommendationsController');

// Mocking the recommendationsController method
jest.mock('../controllers/recommendationsController', () => ({
    getRecommendations: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/recommendations', recommendationsRoutes);

describe('Recommendations Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /recommendations/:userId should call recommendationsController.getRecommendations', async () => {
        recommendationsController.getRecommendations.mockResolvedValueOnce({ recommendations: [{ movie_id: 1, type: 'movie' }, { movie_id: 2, type: 'tv_show' }] });
        const response = await request(app).get('/recommendations/123');
        expect(recommendationsController.getRecommendations).toHaveBeenCalledWith({ params: { userId: '123' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ recommendations: [{ movie_id: 1, type: 'movie' }, { movie_id: 2, type: 'tv_show' }] });
    });
});
