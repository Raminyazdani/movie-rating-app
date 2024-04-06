const request = require('supertest');
const express = require('express');
const favoritesRoutes = require('../routes/favoritesRoutes');
const favoritesController = require('../controllers/favoritesController');

// Mocking the favoritesController methods
jest.mock('../controllers/favoritesController', () => ({
    fetchFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/favorites', favoritesRoutes);

describe('Favorites Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /favorites/:userId should call favoritesController.fetchFavorites', async () => {
        favoritesController.fetchFavorites.mockResolvedValueOnce([{ movie_id: 123, type: 'movie' }]);
        const response = await request(app).get('/favorites/1');
        expect(favoritesController.fetchFavorites).toHaveBeenCalledWith({ params: { userId: '1' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ movie_id: 123, type: 'movie' }]);
    });

    it('POST /favorites should call favoritesController.addFavorite', async () => {
        favoritesController.addFavorite.mockResolvedValueOnce([{ movie_id: 123, type: 'movie' }]);
        const response = await request(app).post('/favorites').send({ userId: 1, imdbId: 123, type: 'movie' });
        expect(favoritesController.addFavorite).toHaveBeenCalledWith({ body: { userId: 1, imdbId: 123, type: 'movie' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ movie_id: 123, type: 'movie' }]);
    });

    it('DELETE /favorites/:userId/:imdbId/:type should call favoritesController.removeFavorite', async () => {
        favoritesController.removeFavorite.mockResolvedValueOnce([{ movie_id: 123, type: 'movie' }]);
        const response = await request(app).delete('/favorites/1/123/movie');
        expect(favoritesController.removeFavorite).toHaveBeenCalledWith({ params: { userId: '1', imdbId: '123', type: 'movie' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ movie_id: 123, type: 'movie' }]);
    });
});
